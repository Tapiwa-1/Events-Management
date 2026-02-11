import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Me (Profile)
router.get('/me', authenticateToken, authController.me);

// Update Profile
router.put('/profile', authenticateToken, authController.updateProfile);

// Admin: Audit Logs
router.get('/logs', authenticateToken, authorizeRole(['admin']), authController.getLogs);

export default router;
