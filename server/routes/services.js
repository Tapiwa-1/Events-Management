import express from 'express';
import * as servicesController from '../controllers/servicesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/availability', authenticateToken, servicesController.getAvailability);

router.post('/book', authenticateToken, servicesController.bookService);

export default router;
