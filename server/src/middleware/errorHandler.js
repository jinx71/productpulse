const { fail } = require('../utils/apiResponse');

// The single place every error ends up (thrown in controllers, forwarded by
// asyncHandler, or passed via next(err)). It maps common library errors to
// sensible HTTP status codes and always replies in our standard envelope.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = [];

  // Mongoose: bad ObjectId (e.g. /products/not-a-real-id)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongo: duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `That ${field} is already in use`;
  }

  if (status >= 500) {
    console.error('✗ Unhandled error:', err);
  }

  return fail(res, message, status, errors);
};

module.exports = errorHandler;
