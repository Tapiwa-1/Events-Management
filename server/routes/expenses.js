import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  const db = await getDb();
  // Join with events to get event name if linked
  const expenses = await db.all(`
    SELECT e.*, ev.name as event_name
    FROM expenses e
    LEFT JOIN events ev ON e.event_id = ev.id
    ORDER BY e.date DESC
  `);
  res.json(expenses);
});

// Create new expense
router.post('/', async (req, res) => {
  const { date, category, amount, description, assistant_name, event_id } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO expenses (date, category, amount, description, assistant_name, event_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [date, category, amount, description, assistant_name, event_id]
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  const db = await getDb();
  try {
    await db.run('DELETE FROM expenses WHERE id = ?', req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
