import { CakeOrder } from '../models/CakeOrder.js';

export const getOrders = async (req, res) => {
    const orders = await CakeOrder.all();
    res.json(orders);
};

export const createOrder = async (req, res) => {
    const { event_id, flavor, dietary_restrictions, design_notes, due_date } = req.body;
    try {
        const result = await CakeOrder.create({
            event_id, flavor, dietary_restrictions, design_notes, status: 'received', due_date
        });
        res.json({ id: result.id, status: 'received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await CakeOrder.update(req.params.id, { status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
