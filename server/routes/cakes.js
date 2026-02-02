import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM cake_orders');
    res.json(orders);
});

router.post('/', async (req, res) => {
    const { event_id, flavor, dietary_restrictions, design_notes, due_date } = req.body;
    const db = await getDb();

    try {
        const result = await db.run(
            `INSERT INTO cake_orders (event_id, flavor, dietary_restrictions, design_notes, status, due_date)
             VALUES (?, ?, ?, ?, 'received', ?)`,
             [event_id, flavor, dietary_restrictions, design_notes, due_date]
        );
        res.json({ id: result.lastID, status: 'received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update status
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const db = await getDb();
    try {
        await db.run('UPDATE cake_orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
