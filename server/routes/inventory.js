import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Get inventory with availability check
router.get('/', async (req, res) => {
  const { start_time, end_time } = req.query;
  const db = await getDb();

  // Get all items
  const items = await db.all('SELECT * FROM inventory_items');

  if (!start_time || !end_time) {
    // If no date range, just return total stock
    return res.json(items.map(i => ({ ...i, available_quantity: i.total_quantity })));
  }

  // Calculate availability
  const availabilityPromises = items.map(async (item) => {
    // Find bookings that overlap with requested [start_time, end_time]
    // Overlap condition: BookingStart < ReqEnd AND (BookingEnd + Buffer) > ReqStart

    // We only care about active bookings (not returned? or just future scheduled?)
    // If we are planning, we look at scheduled times.
    // If returned=1, it means the event is over. But buffer might still apply.
    // The safest is to rely on scheduled times for planning conflicts.
    // Assuming status != 'cancelled'

    const query = `
      SELECT SUM(quantity) as booked_qty
      FROM inventory_bookings
      WHERE item_id = ?
      AND start_time < ?
      AND datetime(end_time, '+' || ? || ' hours') > ?
      AND status != 'cancelled'
    `;

    const result = await db.get(query, [item.id, end_time, item.buffer_time_hours, start_time]);
    const bookedQty = result.booked_qty || 0;
    return { ...item, available_quantity: item.total_quantity - bookedQty };
  });

  const itemsWithAvailability = await Promise.all(availabilityPromises);
  res.json(itemsWithAvailability);
});

// Book an item
router.post('/book', async (req, res) => {
  const { event_id, item_id, quantity, start_time, end_time } = req.body;
  const db = await getDb();

  // Check availability first
  const item = await db.get('SELECT * FROM inventory_items WHERE id = ?', item_id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Logic to check if we have enough stock
  // Calculate booked quantity for this period
  const query = `
      SELECT SUM(quantity) as booked_qty
      FROM inventory_bookings
      WHERE item_id = ?
      AND start_time < ?
      AND datetime(end_time, '+' || ? || ' hours') > ?
      AND status != 'cancelled'
    `;
  const result = await db.get(query, [item_id, end_time, item.buffer_time_hours, start_time]);
  const currentBooked = result.booked_qty || 0;

  if (currentBooked + quantity > item.total_quantity) {
    return res.status(409).json({ error: 'Not enough availability' });
  }

  try {
    const insertResult = await db.run(
      `INSERT INTO inventory_bookings (event_id, item_id, quantity, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event_id, item_id, quantity, start_time, end_time, 'reserved']
    );
    res.json({ id: insertResult.lastID, status: 'reserved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return / Update booking
router.put('/booking/:id', async (req, res) => {
    const { status, returned, damaged } = req.body;
    const db = await getDb();

    const updates = [];
    const params = [];

    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
    }
    if (returned !== undefined) {
        updates.push('returned = ?');
        params.push(returned);
    }
    if (damaged !== undefined) {
        updates.push('damaged = ?');
        params.push(damaged);
    }

    if (updates.length === 0) return res.json({message: 'No updates'});

    params.push(req.params.id);

    await db.run(`UPDATE inventory_bookings SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
});

export default router;
