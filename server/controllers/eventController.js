import { sendSMS } from '../broadcast/smsSender.js';
import { Event } from '../models/Event.js';
import { InventoryBooking } from '../models/InventoryBooking.js';

export const getEvents = async (req, res) => {
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
};

export const createEvent = async (req, res) => {
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
};

export const updateEvent = async (req, res) => {
  let { status, failure_reason, amount_paid, name, client_phone, location, date, start_time, end_time, type, total_cost, transport_cost } = req.body;

  try {
    // If status is completing, auto-pay remaining balance
    if (status === 'completed') {
        const current = await Event.find(req.params.id);
        const finalTotal = (total_cost !== undefined) ? total_cost : current.total_cost;
        amount_paid = finalTotal;
    }

    const fields = { status, failure_reason, amount_paid, name, client_phone, location, date, start_time, end_time, type, total_cost, transport_cost };

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
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.find(req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
