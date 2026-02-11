import { sendSMS } from '../broadcast/smsSender.js';
import { getRecipients } from '../broadcast/audienceManager.js';
import { Inquiry } from '../models/Inquiry.js';
import { Event } from '../models/Event.js';

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.query('SELECT * FROM inquiries ORDER BY date DESC');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createInquiry = async (req, res) => {
  const { name, phone, message } = req.body;
  try {
    const result = await Inquiry.create({ name, phone, message });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendBroadcast = async (req, res) => {
  const { to, message, audience } = req.body;
  try {
    const effectiveAudience = audience || 'manual';
    const recipients = await getRecipients(effectiveAudience, to);
    const result = await sendSMS(recipients, message);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const runAutomations = async (req, res) => {
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
                };

                let status = inquiry.status;
                if (newCount >= 3) {
                    status = 'removed';
                    removedCount++;
                }
                updateData.status = status;
                updateData.last_message_sent = new Date().toISOString();

                await Inquiry.update(inquiry.id, updateData);
            }
        }

        res.json({ success: true, sent_count: sentCount, removed_count: removedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const mockReminders = async (req, res) => {
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
};
