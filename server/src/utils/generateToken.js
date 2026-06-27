const jwt = require('jsonwebtoken');

// Signs a short-lived JWT carrying just the user id. The id is enough —
// the protect middleware re-loads the fresh user from Mongo on each request.
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
