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
  // Fetch loans with calculated paid amount
  const loans = await db.all(`
    SELECT l.*, COALESCE(SUM(r.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN loan_repayments r ON l.id = r.loan_id
    GROUP BY l.id
    ORDER BY l.date_given DESC
  `);
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

router.get('/loans/repayments', async (req, res) => {
  const db = await getDb();
  const repayments = await db.all(`
    SELECT r.*, l.borrower
    FROM loan_repayments r
    JOIN loans l ON r.loan_id = l.id
    ORDER BY r.date DESC
  `);
  res.json(repayments);
});

router.post('/loans/:id/repay', async (req, res) => {
  const { id } = req.params;
  const { date, amount, method, notes } = req.body;
  const db = await getDb();

  try {
    await db.run(
      `INSERT INTO loan_repayments (loan_id, date, amount, method, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [id, date, amount, method, notes]
    );

    // Check if fully paid
    const loan = await db.get(`SELECT amount FROM loans WHERE id = ?`, id);
    const paid = await db.get(`SELECT SUM(amount) as total FROM loan_repayments WHERE loan_id = ?`, id);

    if (loan && paid && paid.total >= loan.amount) {
      await db.run(`UPDATE loans SET status = 'Repaid' WHERE id = ?`, id);
    }

    res.json({ message: 'Repayment recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
