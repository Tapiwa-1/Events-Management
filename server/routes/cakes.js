import express from 'express';
import * as cakesController from '../controllers/cakesController.js';

const router = express.Router();

router.get('/', cakesController.getOrders);

router.post('/', cakesController.createOrder);

// Update status
router.put('/:id/status', cakesController.updateStatus);

export default router;
