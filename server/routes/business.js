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

router.get('/loans', async (req, res) => {
  const db = await getDb();
  const loans = await db.all('SELECT * FROM loans ORDER BY date_given DESC');
  res.json(loans);
});

router.post('/loans', async (req, res) => {
  const { borrower, type, date_given, amount, interest, due_date, status } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO loans (borrower, type, date_given, amount, interest, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [borrower, type, date_given, amount, interest, due_date, status || 'Active']
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
