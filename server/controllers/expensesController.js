import { Expense } from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.query(`
        SELECT e.*, ev.name as event_name
        FROM expenses e
        LEFT JOIN events ev ON e.event_id = ev.id
        ORDER BY e.date DESC
    `);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  const { date, category, amount, description, assistant_name, event_id } = req.body;
  try {
    const expense = await Expense.create({ date, category, amount, description, assistant_name, event_id });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await Expense.delete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
