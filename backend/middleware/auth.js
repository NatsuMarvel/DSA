const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('Auth middleware: missing Authorization header for', req.path);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  if (!token) {
    console.warn('Auth middleware: empty Authorization token for', req.path);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    // attach user (optional)
    req.user = await User.findById(payload.id);
    if (!req.user) {
      console.warn('Auth middleware: token valid but user record not found', payload.id);
      return res.status(401).json({ error: 'User not found' });
    }
    next();
  } catch (err) {
    console.warn('Auth middleware: invalid token for', req.path, err && err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;