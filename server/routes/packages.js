import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as packagesController from '../controllers/packagesController.js';

const router = express.Router();

// Public pricing for landing page
router.get('/public', packagesController.getPublicPackages);

// Admin management routes
router.get('/', authenticateToken, authorizeRole(['admin']), packagesController.getAdminPackages);
router.put('/', authenticateToken, authorizeRole(['admin']), packagesController.updatePackages);

export default router;
