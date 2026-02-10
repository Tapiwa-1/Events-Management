import { Photographer } from '../models/Photographer.js';
import { ServiceBooking } from '../models/ServiceBooking.js';

export const getAvailability = async (req, res) => {
  const { start_time, end_time } = req.query;

  const photographers = await Photographer.all();

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
      const result = await ServiceBooking.first(query, [p.id, end_time, start_time]);
      return { ...p, is_available: result.count === 0 };
  });

  const results = await Promise.all(availabilityPromises);
  res.json(results);
};

export const bookService = async (req, res) => {
    const { event_id, photographer_id, start_time, end_time } = req.body;

    // Check if photographer is available
    const conflictQuery = `
          SELECT count(*) as count
          FROM service_bookings
          WHERE photographer_id = ?
          AND start_time < ?
          AND end_time > ?
          AND status != 'cancelled'
    `;
    const conflict = await ServiceBooking.first(conflictQuery, [photographer_id, end_time, start_time]);

    if (conflict.count > 0) {
        return res.status(409).json({ error: 'Photographer is not available' });
    }

    try {
        const result = await ServiceBooking.create({
             event_id, photographer_id, start_time, end_time, status: 'confirmed', post_prod_status: 'pending'
        });
        res.json({ id: result.id, status: 'confirmed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
