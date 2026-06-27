// One response shape for the whole portfolio.
//   success -> { success: true,  data, message? }
//   failure -> { success: false, message, errors: [] }
// Controllers call these helpers so the envelope never drifts between apps.

const ok = (res, data = null, message, status = 200) => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
};

const created = (res, data = null, message = 'Created') =>
  ok(res, data, message, 201);

const fail = (res, message = 'Something went wrong', status = 400, errors = []) =>
  res.status(status).json({ success: false, message, errors });

module.exports = { ok, created, fail };
