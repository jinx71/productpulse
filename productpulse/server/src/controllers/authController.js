const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { ok, created, fail } = require('../utils/apiResponse');

// Shape a user + signed token for the client. Password is already stripped by
// the model's toJSON, but we build the object explicitly to be deliberate.
const authPayload = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
  },
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, 'Validation failed', 422, result.array());
  }

  const { name, email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return fail(res, 'That email is already registered', 409);

  const user = await User.create({ name, email, password });
  return created(res, authPayload(user), 'Account created');
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, 'Validation failed', 422, result.array());
  }

  const { email, password } = req.body;

  // password has select:false, so explicitly pull it for the comparison.
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, 'Invalid email or password', 401);
  }

  return ok(res, authPayload(user), 'Signed in');
});

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => {
  return ok(res, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarColor: req.user.avatarColor,
    },
  });
});

module.exports = { register, login, getMe };
