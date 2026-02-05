import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const events = await db.all(`
    SELECT events.*, clients.name as client_name
    FROM events
    LEFT JOIN clients ON events.client_id = clients.id
  `);
  res.json(events);
});

router.post('/', async (req, res) => {
  const { client_id, name, date, start_time, end_time, location, type, status, amount_paid, total_cost, transport_cost } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO events (client_id, name, date, start_time, end_time, location, type, status, amount_paid, total_cost, transport_cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, name, date, start_time, end_time, location, type, status || 'planned', amount_paid || 0, total_cost || 0, transport_cost || 0]
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  let { status, failure_reason, amount_paid, name, location, date, start_time, end_time, type, total_cost, transport_cost } = req.body;
  const db = await getDb();

  // If status is completing, auto-pay remaining balance
  if (status === 'completed') {
      // We need to know the total cost. If provided in update, use it. If not, fetch from DB.
      // Optimization: Just assume frontend sends current total_cost or we fetch it.
      // Let's fetch the current event state to be safe if total_cost isn't in body
      const current = await db.get('SELECT total_cost FROM events WHERE id = ?', req.params.id);
      const finalTotal = (total_cost !== undefined) ? total_cost : current.total_cost;

      // Set amount_paid to total_cost
      amount_paid = finalTotal;
  }

  // Dynamic update query
  const updates = [];
  const params = [];

  const fields = { status, failure_reason, amount_paid, name, location, date, start_time, end_time, type, total_cost, transport_cost };

  for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value);
      }
  }

  if (updates.length === 0) return res.json({ message: 'No updates' });

  params.push(req.params.id);

  try {
      await db.run(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`, params);
      res.json({ message: 'Event updated' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const event = await db.get('SELECT * FROM events WHERE id = ?', req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

export default router;
