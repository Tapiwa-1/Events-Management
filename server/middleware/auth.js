import jwt from 'jsonwebtoken';
import crypto from 'crypto';

let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET is not defined in environment variables.');
  } else {
    console.warn('WARNING: JWT_SECRET is not defined. Using a temporary random secret. Tokens will be invalid after restart.');
    JWT_SECRET = crypto.randomBytes(64).toString('hex');
  }
}

export const authenticateToken = (req, res, next) => {
  // Check cookie first, then Auth header
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.full_name },
        JWT_SECRET,
        { expiresIn: '8h' }
    );
};
