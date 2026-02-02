import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/dispatch', async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ error: 'Date required' });

    const db = await getDb();

    // Get events for this date
    const events = await db.all('SELECT * FROM events WHERE date = ?', date);

    const dispatchList = await Promise.all(events.map(async (event) => {
        // Get inventory items
        const items = await db.all(`
            SELECT i.name, ib.quantity, i.type
            FROM inventory_bookings ib
            JOIN inventory_items i ON ib.item_id = i.id
            WHERE ib.event_id = ?
        `, event.id);

        // Get cakes
        const cakes = await db.all(`
            SELECT * FROM cake_orders WHERE event_id = ?
        `, event.id);

        return {
            event: event,
            items: items,
            cakes: cakes
        };
    }));

    res.json(dispatchList);
});

export default router;
