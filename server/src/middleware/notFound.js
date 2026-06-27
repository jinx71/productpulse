const { fail } = require('../utils/apiResponse');

// Reached only when no route matched. Forwards a 404 in our envelope.
const notFound = (req, res) =>
  fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);

module.exports = notFound;
