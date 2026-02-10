import express from 'express';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendSMS } from '../broadcast/smsSender.js';
import { getRecipients } from '../broadcast/audienceManager.js';

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

// Send SMS
router.post('/sms/send', async (req, res) => {
  const { to, message, audience } = req.body; // to can be array or string (for manual)
  const db = await getDb();
  try {
    // Determine recipients using audience manager
    // If audience is manual, 'to' is passed. Otherwise 'to' might be ignored or used differently.
    // The extracted function logic handles this if we pass manual 'to' correctly.
    // In my extraction, I used (audience, db, manualTo).

    // Logic check: if audience is undefined/null (manual mode likely implies audience='manual' from frontend),
    // but if frontend just sends 'to', we might need to handle defaults.
    // Assuming frontend sends audience='manual' when specific numbers are provided.

    // Compatibility: If 'audience' is not provided but 'to' is, treat as manual.
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
                await sendSMS(inquiry.phone, `Follow-up ${inquiry.message_count + 1}/3`);
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
