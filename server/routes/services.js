import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/availability', async (req, res) => {
  const { start_time, end_time } = req.query;
  const db = await getDb();

  const photographers = await db.all('SELECT * FROM photographers');

  if (!start_time || !end_time) {
      return res.json(photographers.map(p => ({...p, is_available: true})));
  }

  const availabilityPromises = photographers.map(async (p) => {
      // Check for overlapping bookings
      const query = `
          SELECT count(*) as count
          FROM service_bookings
          WHERE photographer_id = ?
          AND start_time < ?
          AND end_time > ?
          AND status != 'cancelled'
      `;
      const result = await db.get(query, [p.id, end_time, start_time]);
      return { ...p, is_available: result.count === 0 };
  });

  const results = await Promise.all(availabilityPromises);
  res.json(results);
});

router.post('/book', async (req, res) => {
    const { event_id, photographer_id, start_time, end_time } = req.body;
    const db = await getDb();

    // Check if photographer is available
    const conflictQuery = `
          SELECT count(*) as count
          FROM service_bookings
          WHERE photographer_id = ?
          AND start_time < ?
          AND end_time > ?
          AND status != 'cancelled'
    `;
    const conflict = await db.get(conflictQuery, [photographer_id, end_time, start_time]);

    if (conflict.count > 0) {
        return res.status(409).json({ error: 'Photographer is not available' });
    }

    try {
        const result = await db.run(
            `INSERT INTO service_bookings (event_id, photographer_id, start_time, end_time, status, post_prod_status)
             VALUES (?, ?, ?, ?, 'confirmed', 'pending')`,
             [event_id, photographer_id, start_time, end_time]
        );
        res.json({ id: result.lastID, status: 'confirmed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
