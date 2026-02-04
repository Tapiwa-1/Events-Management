import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/transactions', async (req, res) => {
  const db = await getDb();
  const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC');
  res.json(transactions);
});

router.post('/transactions', async (req, res) => {
  const { date, description, amount, type, category, method, notes } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO transactions (date, description, amount, type, category, method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [date, description, amount, type, category, method, notes]
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
