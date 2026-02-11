import express from 'express';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { getDb } from '../database.js';
import { sendSMS } from '../broadcast/smsSender.js';
import { Event } from '../models/Event.js';
import { InventoryBooking } from '../models/InventoryBooking.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.query(`
        SELECT events.*, clients.name as client_name
        FROM events
        LEFT JOIN clients ON events.client_id = clients.id
    `);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { client_id, name, client_phone, date, start_time, end_time, location, type, status, amount_paid, total_cost, transport_cost, inventory } = req.body;
  try {
    const event = await Event.create({
        client_id, name, client_phone, date, start_time, end_time, location, type,
        status: status || 'planned',
        amount_paid: amount_paid || 0,
        total_cost: total_cost || 0,
        transport_cost: transport_cost || 0
    });

    if (client_phone) {
      await sendSMS(client_phone, `Your event '${name}' has been booked successfully!`);
    }

    // Handle Inventory Bookings
    if (inventory && Array.isArray(inventory) && inventory.length > 0) {
        for (const item of inventory) {
            if (item.quantity > 0) {
                await InventoryBooking.create({
                    event_id: event.id,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    start_time,
                    end_time,
                    status: 'reserved'
                });
            }
        }
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  let { status, failure_reason, amount_paid, name, client_phone, location, date, start_time, end_time, type, total_cost, transport_cost, google_sheet_url } = req.body;

  try {
    // If status is completing, auto-pay remaining balance
    if (status === 'completed') {
        const current = await Event.find(req.params.id);
        const finalTotal = (total_cost !== undefined) ? total_cost : current.total_cost;
        amount_paid = finalTotal;
    }

    const fields = { status, failure_reason, amount_paid, name, client_phone, location, date, start_time, end_time, type, total_cost, transport_cost, google_sheet_url };

    // Filter undefined
    const dataToUpdate = {};
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            dataToUpdate[key] = value;
        }
    }

    if (Object.keys(dataToUpdate).length === 0) return res.json({ message: 'No updates' });

    await Event.update(req.params.id, dataToUpdate);
    res.json({ message: 'Event updated' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.find(req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/sync-sheet', async (req, res) => {
  try {
    const event = await Event.find(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.google_sheet_url) return res.status(400).json({ error: 'Google Sheet URL not set' });

    // Transform URL to CSV export URL
    let csvUrl = event.google_sheet_url;
    if (csvUrl.includes('/edit')) {
        csvUrl = csvUrl.replace(/\/edit.*/, '/export?format=csv');
    }

    const response = await axios.get(csvUrl);
    const records = parse(response.data, {
        columns: false,
        skip_empty_lines: true
    });

    // Job Section starts at index 7 (Date), 8 (Name), 9 (Phone), 10 (Deposit), 11 (Remaining), 12 (Location), 13 (Transport)
    const targetPhone = (event.client_phone || '').replace(/\D/g, '').slice(-9);
    if (!targetPhone) return res.status(400).json({ error: 'Client phone not set on event' });

    let foundRow = null;
    for (const row of records) {
        if (row.length < 10) continue;
        const phoneCell = row[9];
        if (!phoneCell) continue;

        const sheetPhone = phoneCell.replace(/\D/g, '').slice(-9);
        if (sheetPhone === targetPhone) {
            foundRow = row;
            break;
        }
    }

    if (!foundRow) {
        return res.status(404).json({ error: 'Event not found in sheet (by phone number)' });
    }

    const deposit = parseFloat(foundRow[10]) || 0;
    const remaining = parseFloat(foundRow[11]) || 0;
    const transport = parseFloat(foundRow[13]) || 0;

    const totalCost = deposit + remaining;
    // Logic: If Remaining > 0, amount_paid = Deposit. If Remaining <= 0, amount_paid = Total (assume fully paid).
    const isPaid = remaining <= 0;
    const amountPaid = isPaid ? totalCost : deposit;

    await Event.update(event.id, {
        total_cost: totalCost,
        amount_paid: amountPaid,
        transport_cost: transport
    });

    const updatedEvent = await Event.find(event.id);
    res.json(updatedEvent);

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
});

export default router;
