import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Get inventory with availability check
router.get('/', async (req, res) => {
  const { start_time, end_time, type } = req.query;
  const db = await getDb();

  let query = 'SELECT * FROM inventory_items';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  const items = await db.all(query, params);

  if (!start_time || !end_time) {
    return res.json(items.map(i => ({ ...i, available_quantity: i.total_quantity })));
  }

  const availabilityPromises = items.map(async (item) => {
    const q = `
      SELECT SUM(quantity) as booked_qty
      FROM inventory_bookings
      WHERE item_id = ?
      AND start_time < ?
      AND datetime(end_time, '+' || ? || ' hours') > ?
      AND status != 'cancelled'
    `;

    const result = await db.get(q, [item.id, end_time, item.buffer_time_hours, start_time]);
    const bookedQty = result.booked_qty || 0;
    return { ...item, available_quantity: item.total_quantity - bookedQty };
  });

  const itemsWithAvailability = await Promise.all(availabilityPromises);
  res.json(itemsWithAvailability);
});

// Create new inventory item
router.post('/', async (req, res) => {
    const { name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked } = req.body;
    const db = await getDb();
    try {
        const result = await db.run(
            `INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked]
        );
        res.json({ id: result.lastID, success: true });
    } catch (err) {
        console.error('Error creating inventory item:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    const { name, category, total_quantity, buffer_time_hours, condition, location, last_checked } = req.body;
    const db = await getDb();
    try {
        await db.run(
            `UPDATE inventory_items SET
             name = ?, category = ?, total_quantity = ?, buffer_time_hours = ?, condition = ?, location = ?, last_checked = ?
             WHERE id = ?`,
            [name, category, total_quantity, buffer_time_hours, condition, location, last_checked, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Book an item
router.post('/book', async (req, res) => {
  const { event_id, item_id, quantity, start_time, end_time } = req.body;
  const db = await getDb();

  const item = await db.get('SELECT * FROM inventory_items WHERE id = ?', item_id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

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

// Update booking (Return, Move, Update Status)
router.put('/booking/:id', async (req, res) => {
    const { status, returned, damaged, qty_out, qty_back, missing, condition_return } = req.body;
    const db = await getDb();

    const updates = [];
    const params = [];

    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (returned !== undefined) { updates.push('returned = ?'); params.push(returned); }
    if (damaged !== undefined) { updates.push('damaged = ?'); params.push(damaged); }
    if (qty_out !== undefined) { updates.push('qty_out = ?'); params.push(qty_out); }
    if (qty_back !== undefined) { updates.push('qty_back = ?'); params.push(qty_back); }
    if (missing !== undefined) { updates.push('missing = ?'); params.push(missing); }
    if (condition_return !== undefined) { updates.push('condition_return = ?'); params.push(condition_return); }

    if (updates.length === 0) return res.json({message: 'No updates'});

    params.push(req.params.id);

    try {
        await db.run(`UPDATE inventory_bookings SET ${updates.join(', ')} WHERE id = ?`, params);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Movement Log (Bookings for an event or all)
router.get('/movement', async (req, res) => {
    const { event_id } = req.query;
    const db = await getDb();

    let query = `
        SELECT ib.*, ii.name as item_name, e.name as event_name, e.date as event_date
        FROM inventory_bookings ib
        JOIN inventory_items ii ON ib.item_id = ii.id
        JOIN events e ON ib.event_id = e.id
    `;
    const params = [];

    if (event_id) {
        query += ' WHERE ib.event_id = ?';
        params.push(event_id);
    }

    query += ' ORDER BY e.date DESC';

    try {
        const logs = await db.all(query, params);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Maintenance Logs ---

router.get('/maintenance', async (req, res) => {
    const db = await getDb();
    try {
        const logs = await db.all(`
            SELECT ml.*, ii.name as item_name
            FROM maintenance_logs ml
            JOIN inventory_items ii ON ml.item_id = ii.id
            ORDER BY ml.date DESC
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/maintenance', async (req, res) => {
    const { item_id, date, issue, action, cost, status } = req.body;
    console.log('POST /maintenance body:', req.body);
    const db = await getDb();
    try {
        await db.run(
            `INSERT INTO maintenance_logs (item_id, date, issue, action, cost, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [item_id, date, issue, action, cost, status]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('POST /maintenance error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/maintenance/:id', async (req, res) => {
    const { action, cost, status } = req.body;
    const db = await getDb();
    try {
        await db.run(
            `UPDATE maintenance_logs SET action = ?, cost = ?, status = ? WHERE id = ?`,
            [action, cost, status, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Consumables Logs ---

router.get('/consumables', async (req, res) => {
    const db = await getDb();
    try {
        const logs = await db.all(`
            SELECT cl.*, ii.name as item_name
            FROM consumables_logs cl
            JOIN inventory_items ii ON cl.item_id = ii.id
            ORDER BY cl.date DESC
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/consumables', async (req, res) => {
    const { item_id, date, qty_used } = req.body;
    const db = await getDb();
    try {
        // Get current stock (total_quantity) - we might want to update the master record too?
        // Or "balance" is just recorded at that time?
        // Let's deduce balance from inventory_items
        const item = await db.get('SELECT * FROM inventory_items WHERE id = ?', item_id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const newBalance = item.total_quantity - qty_used;

        // Update master stock
        await db.run('UPDATE inventory_items SET total_quantity = ? WHERE id = ?', [newBalance, item_id]);

        // Log usage
        await db.run(
            `INSERT INTO consumables_logs (item_id, date, qty_used, balance) VALUES (?, ?, ?, ?)`,
            [item_id, date, qty_used, newBalance]
        );

        res.json({ success: true, new_balance: newBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
