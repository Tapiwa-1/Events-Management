import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as marketingController from '../controllers/marketingController.js';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Get all inquiries
router.get('/inquiries', marketingController.getInquiries);

// Create inquiry
router.post('/inquiries', marketingController.createInquiry);

// Send SMS
router.post('/sms/send', marketingController.sendBroadcast);

// Run Automated Follow-ups
router.post('/automations/run', marketingController.runAutomations);

// Mock Upcoming Reminders
router.post('/reminders', marketingController.mockReminders);

export default router;
