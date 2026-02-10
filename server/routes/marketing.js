import express from 'express';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Get all inquiries
router.get('/inquiries', async (req, res) => {
  const db = await getDb();
  try {
    const inquiries = await db.all('SELECT * FROM inquiries ORDER BY date DESC');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create inquiry
router.post('/inquiries', async (req, res) => {
  const { name, phone, message } = req.body;
  const db = await getDb();
  try {
    const result = await db.run(
      'INSERT INTO inquiries (name, phone, message) VALUES (?, ?, ?)',
      [name, phone, message]
    );
    res.json({ id: result.lastID, name, phone, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Send SMS
router.post('/sms/send', async (req, res) => {
  const { to, message } = req.body; // to can be array or string
  try {
    const recipients = Array.isArray(to) ? to : [to];
    console.log(`[SMS MOCK] Sending message "${message}" to: ${recipients.join(', ')}`);
    // In a real app, we would call an SMS provider API here
    // and log the result to a database table.
    res.json({ success: true, count: recipients.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Upcoming Reminders
router.post('/reminders', async (req, res) => {
    const db = await getDb();
    try {
        // Find events for "this Saturday"
        // For simplicity in this mock, let's just find events in the next 7 days
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const events = await db.all(
            'SELECT * FROM events WHERE date BETWEEN ? AND ?',
            [today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0]]
        );

        let sentCount = 0;
        for (const event of events) {
            if (event.client_phone) {
                console.log(`[SMS MOCK] Reminder sent to ${event.client_phone} for event ${event.name} on ${event.date}`);
                sentCount++;
            }
        }

        res.json({ success: true, sent_count: sentCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
