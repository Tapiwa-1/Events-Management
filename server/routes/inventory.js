import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

// Get inventory with availability check
router.get('/', inventoryController.getInventory);

// Create new inventory item
router.post('/', inventoryController.createItem);

// Update inventory item
router.put('/:id', inventoryController.updateItem);

// Book an item
router.post('/book', inventoryController.bookItem);

// Update booking (Return, Move, Update Status)
router.put('/booking/:id', inventoryController.updateBooking);

// Get Movement Log (Bookings for an event or all)
router.get('/movement', inventoryController.getMovementLog);

// --- Maintenance Logs ---

router.get('/maintenance', inventoryController.getMaintenanceLogs);

router.post('/maintenance', inventoryController.createMaintenanceLog);

router.put('/maintenance/:id', inventoryController.updateMaintenanceLog);

// --- Consumables Logs ---

router.get('/consumables', inventoryController.getConsumablesLogs);

router.post('/consumables', inventoryController.createConsumableLog);

export default router;
