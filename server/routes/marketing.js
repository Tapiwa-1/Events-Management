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
  const { to, message, audience } = req.body; // to can be array or string
  const db = await getDb();
  try {
    let recipients = [];

    if (audience === 'all') {
        // Fetch all unique phones from inquiries and events
        const inquiryPhones = await db.all('SELECT DISTINCT phone FROM inquiries WHERE phone IS NOT NULL AND status != "removed"');
        const eventPhones = await db.all('SELECT DISTINCT client_phone as phone FROM events WHERE client_phone IS NOT NULL');

        const phoneSet = new Set();
        inquiryPhones.forEach(p => phoneSet.add(p.phone));
        eventPhones.forEach(p => phoneSet.add(p.phone));

        recipients = Array.from(phoneSet);
    } else {
        recipients = Array.isArray(to) ? to : [to];
    }

    console.log(`[SMS MOCK] Sending message "${message}" to ${recipients.length} recipients: ${recipients.join(', ')}`);
    // In a real app, we would call an SMS provider API here
    // and log the result to a database table.
    res.json({ success: true, count: recipients.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run Automated Follow-ups
router.post('/automations/run', async (req, res) => {
    const db = await getDb();
    try {
        // Find inquiries created within last 30 days, message_count < 3, status != 'removed'
        // SQLite: datetime('now', '-30 days')
        const inquiries = await db.all(`
            SELECT * FROM inquiries
            WHERE date >= datetime('now', '-30 days')
            AND message_count < 3
            AND status != 'removed'
        `);

        let sentCount = 0;
        let removedCount = 0;

        for (const inquiry of inquiries) {
            if (inquiry.phone) {
                // Mock Send
                console.log(`[SMS AUTO] Sending follow-up ${inquiry.message_count + 1}/3 to ${inquiry.phone}`);
                sentCount++;

                const newCount = inquiry.message_count + 1;
                const updates = ['message_count = ?', 'last_message_sent = datetime("now")'];
                const params = [newCount];

                if (newCount >= 3) {
                    updates.push("status = 'removed'");
                    removedCount++;
                }

                params.push(inquiry.id);
                await db.run(`UPDATE inquiries SET ${updates.join(', ')} WHERE id = ?`, params);
            }
        }

        res.json({ success: true, sent_count: sentCount, removed_count: removedCount });
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
