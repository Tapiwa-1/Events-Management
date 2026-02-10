import { Transaction } from '../models/Transaction.js';
import { Loan } from '../models/Loan.js';
import { LoanRepayment } from '../models/LoanRepayment.js';

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.query('SELECT * FROM transactions ORDER BY date DESC');
  res.json(transactions);
};

export const createTransaction = async (req, res) => {
  const { date, description, amount, type, category, method, notes } = req.body;
  try {
    const transaction = await Transaction.create({ date, description, amount, type, category, method, notes });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoans = async (req, res) => {
  // Fetch loans with calculated paid amount
  const loans = await Loan.query(`
    SELECT l.*, COALESCE(SUM(r.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN loan_repayments r ON l.id = r.loan_id
    GROUP BY l.id
    ORDER BY l.date_given DESC
  `);
  res.json(loans);
};

export const createLoan = async (req, res) => {
  const { borrower, type, date_given, amount, interest, due_date, status } = req.body;
  try {
    const loan = await Loan.create({
        borrower, type, date_given, amount, interest, due_date,
        status: status || 'Active'
    });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepayments = async (req, res) => {
  const repayments = await LoanRepayment.query(`
    SELECT r.*, l.borrower
    FROM loan_repayments r
    JOIN loans l ON r.loan_id = l.id
    ORDER BY r.date DESC
  `);
  res.json(repayments);
};

export const recordRepayment = async (req, res) => {
  const { id } = req.params;
  const { date, amount, method, notes } = req.body;

  try {
    await LoanRepayment.create({ loan_id: id, date, amount, method, notes });

    // Check if fully paid
    const loan = await Loan.find(id);
    const paid = await LoanRepayment.first(`SELECT SUM(amount) as total FROM loan_repayments WHERE loan_id = ?`, [id]);

    if (loan && paid && paid.total >= loan.amount) {
      await Loan.update(id, { status: 'Repaid' });
    }

    res.json({ message: 'Repayment recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
