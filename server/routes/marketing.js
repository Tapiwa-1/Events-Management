import express from 'express';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendSMS } from '../broadcast/smsSender.js';
import { getRecipients } from '../broadcast/audienceManager.js';
import { Inquiry } from '../models/Inquiry.js';
import { Event } from '../models/Event.js';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Get all inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.query('SELECT * FROM inquiries ORDER BY date DESC');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create inquiry
router.post('/inquiries', async (req, res) => {
  const { name, phone, message } = req.body;
  try {
    const result = await Inquiry.create({ name, phone, message });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send SMS
router.post('/sms/send', async (req, res) => {
  const { to, message, audience } = req.body;
  const db = await getDb(); // Still needed for getRecipients which expects db instance
  try {
    const effectiveAudience = audience || 'manual';
    const recipients = await getRecipients(effectiveAudience, db, to);
    const result = await sendSMS(recipients, message);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run Automated Follow-ups
router.post('/automations/run', async (req, res) => {
    try {
        const inquiries = await Inquiry.query(`
            SELECT * FROM inquiries
            WHERE date >= datetime('now', '-30 days')
            AND message_count < 3
            AND status != 'removed'
        `);

        let sentCount = 0;
        let removedCount = 0;

        for (const inquiry of inquiries) {
            if (inquiry.phone) {
                await sendSMS(inquiry.phone, `Follow-up ${inquiry.message_count + 1}/3`);
                sentCount++;

                const newCount = inquiry.message_count + 1;
                const updateData = {
                    message_count: newCount,
                    // last_message_sent: handled via raw query below because ORM update takes object values, not SQL expressions
                };

                let status = inquiry.status;
                if (newCount >= 3) {
                    status = 'removed';
                    removedCount++;
                }
                updateData.status = status;

                // We need to set last_message_sent to CURRENT_TIMESTAMP or similar.
                // Our simple ORM .update() sets values as parameters.
                // So we'll update status and count first, then use query for timestamp if strict needed,
                // OR just pass the ISO string from JS.
                updateData.last_message_sent = new Date().toISOString();

                await Inquiry.update(inquiry.id, updateData);
            }
        }

        res.json({ success: true, sent_count: sentCount, removed_count: removedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mock Upcoming Reminders
router.post('/reminders', async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const events = await Event.query(
            'SELECT * FROM events WHERE date BETWEEN ? AND ?',
            [today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0]]
        );

        let sentCount = 0;
        for (const event of events) {
            if (event.client_phone) {
                await sendSMS(event.client_phone, `Reminder: Your event ${event.name} is on ${event.date}`);
                sentCount++;
            }
        }

        res.json({ success: true, sent_count: sentCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
