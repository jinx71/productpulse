// ─────────────────────────────────────────────────────────────────────────
// THE ENGINEERING LESSON: a trending / "hot" ranking algorithm.
//
// A naive feed sorts by raw upvotes. The problem: old popular posts calcify
// at the top forever and nothing new ever surfaces. Real launch feeds rank by
// *velocity* — votes relative to age — so fresh, fast-rising items bubble up.
//
// We use the classic Hacker News formula:
//
//        score = votes / (ageHours + 2) ^ gravity
//
//   • numerator (votes)      -> more votes ranks higher
//   • (ageHours + 2)         -> the "+2" is a grace window so a brand-new post
//                               with 0–1 votes isn't divided into oblivion
//   • gravity (~1.8)         -> how aggressively old items decay; higher
//                               gravity = the feed favours recency more
//
// Worked intuition:
//   100 votes, 2h old  -> 100 / (4)^1.8   ≈ 8.7   (hot)
//   100 votes, 24h old -> 100 / (26)^1.8  ≈ 0.27  (cooling)
//     5 votes, 1h old  ->   5 / (3)^1.8   ≈ 0.74  (rising — beats the 24h one)
//
// So a small but *fast* launch can out-rank a big but *stale* one. That is the
// whole point of "trending".
//
// Scaling note: here we compute scores in JS after a DB fetch, which is clear
// and perfect for a portfolio dataset. At real scale you'd precompute the score
// on a column and refresh it (cron / on-vote) so MongoDB can sort + paginate at
// the database, or do it in an aggregation pipeline. The formula is identical;
// only *where* you run it changes.
// ─────────────────────────────────────────────────────────────────────────

const GRAVITY = 1.8;
const HOUR_MS = 1000 * 60 * 60;

/**
 * Compute the hot score for a single item.
 * @param {number} votes      number of upvotes
 * @param {Date|string|number} createdAt  when the item was created
 * @param {number} now        current time in ms (injectable for tests)
 * @returns {number} the hot score (higher = hotter)
 */
function hotScore(votes, createdAt, now = Date.now()) {
  const ageHours = Math.max(0, (now - new Date(createdAt).getTime()) / HOUR_MS);
  return votes / Math.pow(ageHours + 2, GRAVITY);
}

/**
 * Return a new array of products sorted by the requested strategy.
 * Does not mutate the input.
 *   trending -> hot score (votes ÷ age) — the headline feature
 *   top      -> raw upvote count (all-time best)
 *   newest   -> most recently submitted
 */
function rankProducts(products, sort = 'trending') {
  const now = Date.now();
  const list = [...products];

  if (sort === 'newest') {
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (sort === 'top') {
    return list.sort(
      (a, b) =>
        (b.upvotes?.length || 0) - (a.upvotes?.length || 0) ||
        new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // default: trending
  return list.sort(
    (a, b) =>
      hotScore(b.upvotes?.length || 0, b.createdAt, now) -
      hotScore(a.upvotes?.length || 0, a.createdAt, now)
  );
}

module.exports = { hotScore, rankProducts, GRAVITY };
