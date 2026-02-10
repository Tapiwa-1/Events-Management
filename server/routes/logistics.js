import express from 'express';
import * as logisticsController from '../controllers/logisticsController.js';

const router = express.Router();

router.get('/dispatch', logisticsController.getDispatchList);

export default router;
