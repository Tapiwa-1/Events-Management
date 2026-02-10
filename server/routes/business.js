import express from 'express';
import * as businessController from '../controllers/businessController.js';

const router = express.Router();

router.get('/transactions', businessController.getTransactions);
router.post('/transactions', businessController.createTransaction);

router.get('/loans', businessController.getLoans);
router.post('/loans', businessController.createLoan);

router.get('/loans/repayments', businessController.getRepayments);
router.post('/loans/:id/repay', businessController.recordRepayment);

export default router;
