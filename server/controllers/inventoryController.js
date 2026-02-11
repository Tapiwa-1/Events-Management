import { InventoryItem } from '../models/InventoryItem.js';
import { InventoryBooking } from '../models/InventoryBooking.js';
import { MaintenanceLog } from '../models/MaintenanceLog.js';
import { ConsumableLog } from '../models/ConsumableLog.js';

export const getInventory = async (req, res) => {
  const { start_time, end_time, type } = req.query;

  let query = 'SELECT * FROM inventory_items';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  const items = await InventoryItem.query(query, params);

  if (!start_time || !end_time) {
    return res.json(items.map(i => ({ ...i, available_quantity: i.total_quantity })));
  }

  const availabilityPromises = items.map(async (item) => {
    const q = `
      SELECT SUM(quantity) as booked_qty
      FROM inventory_bookings
      WHERE item_id = ?
      AND start_time < ?
      AND datetime(end_time, '+' || ? || ' hours') > ?
      AND status != 'cancelled'
    `;

    // Access db directly via model.db() or static query/first
    const result = await InventoryBooking.first(q, [item.id, end_time, item.buffer_time_hours, start_time]);
    const bookedQty = result && result.booked_qty ? result.booked_qty : 0;
    return { ...item, available_quantity: item.total_quantity - bookedQty };
  });

  const itemsWithAvailability = await Promise.all(availabilityPromises);
  res.json(itemsWithAvailability);
};

export const createItem = async (req, res) => {
    const { name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked } = req.body;
    try {
        const result = await InventoryItem.create({ name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked });
        res.json({ id: result.id, success: true });
    } catch (err) {
        console.error('Error creating inventory item:', err);
        res.status(500).json({ error: err.message });
    }
};

export const updateItem = async (req, res) => {
    const { name, category, total_quantity, buffer_time_hours, condition, location, last_checked } = req.body;
    try {
        await InventoryItem.update(req.params.id, {
             name, category, total_quantity, buffer_time_hours, condition, location, last_checked
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const bookItem = async (req, res) => {
  const { event_id, item_id, quantity, start_time, end_time } = req.body;

  const item = await InventoryItem.find(item_id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const query = `
      SELECT SUM(quantity) as booked_qty
      FROM inventory_bookings
      WHERE item_id = ?
      AND start_time < ?
      AND datetime(end_time, '+' || ? || ' hours') > ?
      AND status != 'cancelled'
    `;
  const result = await InventoryBooking.first(query, [item_id, end_time, item.buffer_time_hours, start_time]);
  const currentBooked = result && result.booked_qty ? result.booked_qty : 0;

  if (currentBooked + quantity > item.total_quantity) {
    return res.status(409).json({ error: 'Not enough availability' });
  }

  try {
    const booking = await InventoryBooking.create({
        event_id, item_id, quantity, start_time, end_time, status: 'reserved'
    });
    res.json({ id: booking.id, status: 'reserved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBooking = async (req, res) => {
    const { status, returned, damaged, qty_out, qty_back, missing, condition_return } = req.body;

    const dataToUpdate = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (returned !== undefined) dataToUpdate.returned = returned;
    if (damaged !== undefined) dataToUpdate.damaged = damaged;
    if (qty_out !== undefined) dataToUpdate.qty_out = qty_out;
    if (qty_back !== undefined) dataToUpdate.qty_back = qty_back;
    if (missing !== undefined) dataToUpdate.missing = missing;
    if (condition_return !== undefined) dataToUpdate.condition_return = condition_return;

    if (Object.keys(dataToUpdate).length === 0) return res.json({message: 'No updates'});

    try {
        await InventoryBooking.update(req.params.id, dataToUpdate);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMovementLog = async (req, res) => {
    const { event_id } = req.query;

    let query = `
        SELECT ib.*, ii.name as item_name, e.name as event_name, e.date as event_date
        FROM inventory_bookings ib
        JOIN inventory_items ii ON ib.item_id = ii.id
        JOIN events e ON ib.event_id = e.id
    `;
    const params = [];

    if (event_id) {
        query += ' WHERE ib.event_id = ?';
        params.push(event_id);
    }

    query += ' ORDER BY e.date DESC';

    try {
        const logs = await InventoryBooking.query(query, params);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await MaintenanceLog.query(`
            SELECT ml.*, ii.name as item_name
            FROM maintenance_logs ml
            JOIN inventory_items ii ON ml.item_id = ii.id
            ORDER BY ml.date DESC
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createMaintenanceLog = async (req, res) => {
    const { item_id, date, issue, action, cost, status } = req.body;
    try {
        await MaintenanceLog.create({ item_id, date, issue, action, cost, status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateMaintenanceLog = async (req, res) => {
    const { action, cost, status } = req.body;
    try {
        await MaintenanceLog.update(req.params.id, { action, cost, status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getConsumablesLogs = async (req, res) => {
    try {
        const logs = await ConsumableLog.query(`
            SELECT cl.*, ii.name as item_name
            FROM consumables_logs cl
            JOIN inventory_items ii ON cl.item_id = ii.id
            ORDER BY cl.date DESC
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createConsumableLog = async (req, res) => {
    const { item_id, date, qty_used } = req.body;
    try {
        const item = await InventoryItem.find(item_id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const newBalance = item.total_quantity - qty_used;

        // Update master stock
        await InventoryItem.update(item_id, { total_quantity: newBalance });

        // Log usage
        await ConsumableLog.create({ item_id, date, qty_used, balance: newBalance });

        res.json({ success: true, new_balance: newBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
