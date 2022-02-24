// Wraps an async controller and forwards any rejected promise to Express's
// error pipeline, so every controller can use plain async/await without a
// try/catch in every function. Errors all funnel into errorHandler.js.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
