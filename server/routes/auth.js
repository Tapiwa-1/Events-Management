import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../database.js';
import { generateToken, authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password, full_name, role } = req.body;

    // Basic validation
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const db = await getDb();

    // Check if exists
    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const userRole = role || 'customer'; // Default to customer

    try {
        const result = await db.run(
            'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            [email, hash, full_name, userRole]
        );
        res.status(201).json({ message: 'User created', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await getDb();

    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.is_active) return res.status(403).json({ error: 'Account disabled' });

    // Update last login
    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', user.id);

    // Log audit
    await db.run('INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [user.id, 'LOGIN', req.ip]
    );

    const token = generateToken(user);

    // Send as HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 3600 * 1000 // 8h
    });

    res.json({
        message: 'Logged in',
        user: { id: user.id, email: user.email, role: user.role, name: user.full_name },
        token // Send token in body too for non-browser clients (if needed)
    });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// Me (Profile)
router.get('/me', authenticateToken, async (req, res) => {
    const db = await getDb();
    const user = await db.get('SELECT id, email, full_name as name, role FROM users WHERE id = ?', req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { full_name, email } = req.body;
    const db = await getDb();

    try {
        await db.run('UPDATE users SET full_name = ?, email = ? WHERE id = ?',
            [full_name, email, req.user.id]
        );
        // Log it
         await db.run('INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'PROFILE_UPDATE', `Updated profile to ${email}`, req.ip]
        );
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Audit Logs
router.get('/logs', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const db = await getDb();
    const logs = await db.all(`
        SELECT l.*, u.email
        FROM audit_logs l
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.timestamp DESC
        LIMIT 100
    `);
    res.json(logs);
});

export default router;
