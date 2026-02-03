import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const events = await db.all('SELECT * FROM events');
  res.json(events);
});

router.post('/', async (req, res) => {
  const { client_id, name, date, start_time, end_time, location, type, status, amount_paid } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO events (client_id, name, date, start_time, end_time, location, type, status, amount_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, name, date, start_time, end_time, location, type, status || 'planned', amount_paid || 0]
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { status, failure_reason, amount_paid, name, location, date, start_time, end_time, type } = req.body;
  const db = await getDb();

  // Dynamic update query
  const updates = [];
  const params = [];

  const fields = { status, failure_reason, amount_paid, name, location, date, start_time, end_time, type };

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
