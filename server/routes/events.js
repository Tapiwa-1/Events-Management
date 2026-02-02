import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const events = await db.all('SELECT * FROM events');
  res.json(events);
});

router.post('/', async (req, res) => {
  const { client_id, name, date, start_time, end_time, location, type, status } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO events (client_id, name, date, start_time, end_time, location, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, name, date, start_time, end_time, location, type, status || 'planned']
    );
    res.json({ id: result.lastID, ...req.body });
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
