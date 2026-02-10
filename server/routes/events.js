import express from 'express';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

router.get('/', eventController.getEvents);

router.post('/', eventController.createEvent);

router.put('/:id', eventController.updateEvent);

router.get('/:id', eventController.getEvent);

export default router;
