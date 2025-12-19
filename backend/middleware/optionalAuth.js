const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function optionalAuth(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return next();
  const token = auth.split(' ')[1];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    req.user = await User.findById(payload.id);
    // if user missing just continue without user (do not fail)
    return next();
  } catch (err) {
    // invalid token — ignore and continue as anonymous
    return next();
  }
}

module.exports = optionalAuth;