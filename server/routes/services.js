import express from 'express';
import * as servicesController from '../controllers/servicesController.js';

const router = express.Router();

router.get('/availability', servicesController.getAvailability);

router.post('/book', servicesController.bookService);

export default router;
