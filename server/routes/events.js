import express from 'express';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { getDb } from '../database.js';
import { sendSMS } from '../broadcast/smsSender.js';
import { Event } from '../models/Event.js';
import { InventoryBooking } from '../models/InventoryBooking.js';

const router = express.Router();

router.post('/import-sheet', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
      let csvUrl = url;
      if (csvUrl.includes('/edit')) {
          csvUrl = csvUrl.replace(/\/edit.*/, '/export?format=csv');
      }

      const response = await axios.get(csvUrl);
      const records = parse(response.data, {
          columns: false,
          skip_empty_lines: true
      });

      let createdCount = 0;
      let updatedCount = 0;

      // Fetch all events upfront to avoid N+1 queries
      const allEvents = await Event.query('SELECT id, client_phone, location, total_cost, amount_paid, transport_cost, status FROM events WHERE client_phone IS NOT NULL');
      const eventMap = new Map();
      for (const event of allEvents) {
          const clean = event.client_phone.replace(/\D/g, '').slice(-9);
          if (clean.length >= 5) {
              if (!eventMap.has(clean)) {
                  eventMap.set(clean, event);
              }
          }
      }

      for (const row of records) {
          if (row.length < 10) continue;

          const rawDate = row[7];
          const name = row[8];
          const rawPhone = row[9];

          // Basic validation to check if this is a data row
          if (!name || !rawPhone || !rawDate) continue;
          // Skip header row usually containing "Date", "Name", etc.
          if (name.toLowerCase() === 'name' || rawPhone.toLowerCase() === 'phone number') continue;

          const deposit = parseFloat(row[10]) || 0;
          const remaining = parseFloat(row[11]) || 0;
          const location = row[12];
          const transport = parseFloat(row[13]) || 0;
          const wasDone = row[14];

          const totalCost = deposit + remaining;
          const isPaid = remaining <= 0;
          const amountPaid = isPaid ? totalCost : deposit;

          // Determine status from 'Was Done' column (Yes/No)
          let status = 'planned';
          if (wasDone && wasDone.trim().toLowerCase() === 'yes') {
              status = 'completed';
          } else if (isPaid) {
              status = 'planned';
          }

          // Normalize Phone for matching
          // Remove all non-digits, keep last 9
          const cleanPhone = rawPhone.replace(/\D/g, '').slice(-9);
          if (cleanPhone.length < 5) continue; // Skip invalid phones

          const existingEvent = eventMap.get(cleanPhone);

          if (existingEvent) {
              await Event.update(existingEvent.id, {
                  total_cost: totalCost,
                  amount_paid: amountPaid,
                  transport_cost: transport,
                  location: location || existingEvent.location,
                  status: status // Update status based on sheet
              });

              // Update in-memory map logic to reflect latest state
              existingEvent.total_cost = totalCost;
              existingEvent.amount_paid = amountPaid;
              existingEvent.transport_cost = transport;
              existingEvent.status = status;
              if (location) existingEvent.location = location;

              updatedCount++;
          } else {
              // Create New
              const currentYear = new Date().getFullYear();
              const dateParts = rawDate.split(' ');
              let formattedDate = new Date().toISOString().split('T')[0]; // fallback

              if (dateParts.length >= 2) {
                  const day = dateParts[0];
                  const monthStr = dateParts[1];
                  const months = {
                      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
                  };
                  const month = months[monthStr.substring(0, 3)];
                  if (month) {
                      const paddedDay = day.length === 1 ? `0${day}` : day;
                      formattedDate = `${currentYear}-${month}-${paddedDay}`;
                  }
              }

              const newEvent = await Event.create({
                  name,
                  client_phone: rawPhone,
                  date: formattedDate,
                  location,
                  status: status,
                  total_cost: totalCost,
                  amount_paid: amountPaid,
                  transport_cost: transport,
                  type: 'Sheet Import'
              });

              eventMap.set(cleanPhone, newEvent);
              createdCount++;
          }
      }

      res.json({ message: 'Import complete', created: createdCount, updated: updatedCount });

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
});

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


export default router;
