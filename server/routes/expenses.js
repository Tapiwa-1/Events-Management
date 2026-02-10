import express from 'express';
import * as expensesController from '../controllers/expensesController.js';

const router = express.Router();

// Get all expenses
router.get('/', expensesController.getExpenses);

// Create new expense
router.post('/', expensesController.createExpense);

// Delete expense
router.delete('/:id', expensesController.deleteExpense);

export default router;
