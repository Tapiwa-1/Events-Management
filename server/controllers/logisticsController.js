import { Event } from '../models/Event.js';
import { InventoryBooking } from '../models/InventoryBooking.js';
import { CakeOrder } from '../models/CakeOrder.js';

export const getDispatchList = async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ error: 'Date required' });

    try {
        const events = await Event.where({ date });

        const dispatchList = await Promise.all(events.map(async (event) => {
            // Get inventory items
            const items = await InventoryBooking.query(`
                SELECT i.name, ib.quantity, i.type
                FROM inventory_bookings ib
                JOIN inventory_items i ON ib.item_id = i.id
                WHERE ib.event_id = ?
            `, [event.id]);

            // Get cakes
            const cakes = await CakeOrder.where({ event_id: event.id });

            return {
                event: event,
                items: items,
                cakes: cakes
            };
        }));

        res.json(dispatchList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
