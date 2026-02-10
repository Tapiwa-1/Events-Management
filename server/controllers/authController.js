import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

export const register = async (req, res) => {
    const { email, password, full_name, role } = req.body;

    // Basic validation
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Check if exists
    const existing = await User.first('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const userRole = role || 'customer'; // Default to customer

    try {
        const result = await User.create({
            email,
            password_hash: hash,
            full_name,
            role: userRole
        });
        res.status(201).json({ message: 'User created', id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.first('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.is_active) return res.status(403).json({ error: 'Account disabled' });

    // Update last login
    await User.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Log audit
    await AuditLog.create({
        user_id: user.id,
        action: 'LOGIN',
        ip_address: req.ip
    });

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
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
    const user = await User.first('SELECT id, email, full_name as name, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

export const updateProfile = async (req, res) => {
    const { full_name, email } = req.body;

    try {
        await User.update(req.user.id, { full_name, email });
        // Log it
         await AuditLog.create({
            user_id: req.user.id,
            action: 'PROFILE_UPDATE',
            details: `Updated profile to ${email}`,
            ip_address: req.ip
        });
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLogs = async (req, res) => {
    const logs = await AuditLog.query(`
        SELECT l.*, u.email
        FROM audit_logs l
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.timestamp DESC
        LIMIT 100
    `);
    res.json(logs);
};
