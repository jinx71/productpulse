const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { fail } = require('../utils/apiResponse');

// Pull a Bearer token out of the Authorization header, if present.
const getToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.split(' ')[1];
  return null;
};

// Hard gate. Rejects the request if there is no valid token.
// On success, attaches the fresh user document to req.user.
const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return fail(res, 'Not authorized — no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return fail(res, 'Not authorized — user no longer exists', 401);
    req.user = user;
    next();
  } catch (err) {
    return fail(res, 'Not authorized — invalid or expired token', 401);
  }
});

// Soft gate. Used on public read routes (the feed, a product page) so that a
// logged-in viewer gets personalised data (e.g. hasVoted) while logged-out
// viewers still see everything. Never blocks.
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch (err) {
    // ignore a bad token here — treat as anonymous
  }
  next();
});

module.exports = { protect, optionalAuth };
