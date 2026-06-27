const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const { rankProducts } = require('../services/ranking');
const { ok, created, fail } = require('../utils/apiResponse');

// Shape a product document for the client. Crucially we send `voteCount` and a
// per-viewer `hasVoted` boolean — NOT the raw array of upvoter ids (that would
// leak who voted and bloat the payload).
const shapeProduct = (product, userId) => {
  const upvotes = product.upvotes || [];
  const hasVoted = userId
    ? upvotes.some((id) => id.toString() === userId.toString())
    : false;

  const submitter = product.submittedBy || {};
  return {
    id: product._id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    url: product.url,
    imageUrl: product.imageUrl,
    category: product.category,
    voteCount: upvotes.length,
    hasVoted,
    submittedBy: submitter._id
      ? { id: submitter._id, name: submitter.name, avatarColor: submitter.avatarColor }
      : null,
    createdAt: product.createdAt,
  };
};

// GET /api/products?sort=trending|newest|top&page=1&limit=10&category=&q=
const listProducts = asyncHandler(async (req, res) => {
  const sort = ['trending', 'newest', 'top'].includes(req.query.sort)
    ? req.query.sort
    : 'trending';
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const { category, q } = req.query;

  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (q && q.trim()) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { tagline: rx }];
  }

  // Fetch the filtered set, then rank in JS (see services/ranking.js for why
  // this is the right call at portfolio scale). Pagination is applied after
  // ranking so the order is correct across pages.
  const all = await Product.find(filter).populate('submittedBy', 'name avatarColor');
  const ranked = rankProducts(all, sort);

  const total = ranked.length;
  const start = (page - 1) * limit;
  const pageItems = ranked.slice(start, start + limit);

  return ok(res, {
    products: pageItems.map((p) => shapeProduct(p, req.user && req.user._id)),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    sort,
  });
});

// GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'submittedBy',
    'name avatarColor'
  );
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, { product: shapeProduct(product, req.user && req.user._id) });
});

// POST /api/products  (protected)
const createProduct = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, 'Validation failed', 422, result.array());
  }

  const { name, tagline, description, url, imageUrl, category } = req.body;

  const product = await Product.create({
    name,
    tagline,
    description,
    url,
    imageUrl: imageUrl || '',
    category,
    submittedBy: req.user._id,
    upvotes: [req.user._id], // creators auto-upvote their own launch
  });

  await product.populate('submittedBy', 'name avatarColor');
  return created(
    res,
    { product: shapeProduct(product, req.user._id) },
    'Launch published'
  );
});

// POST /api/products/:id/upvote  (protected) — toggles the viewer's vote.
// Returns the fresh voteCount + hasVoted so the client can reconcile its
// optimistic update.
const toggleUpvote = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Product not found', 404);

  const userId = req.user._id.toString();
  const already = product.upvotes.some((id) => id.toString() === userId);

  if (already) {
    product.upvotes = product.upvotes.filter((id) => id.toString() !== userId);
  } else {
    product.upvotes.push(req.user._id);
  }
  await product.save();

  return ok(res, {
    id: product._id,
    voteCount: product.upvotes.length,
    hasVoted: !already,
  });
});

// DELETE /api/products/:id  (protected, owner only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Product not found', 404);

  if (product.submittedBy.toString() !== req.user._id.toString()) {
    return fail(res, 'You can only delete your own launches', 403);
  }

  await product.deleteOne();
  await Comment.deleteMany({ product: product._id }); // tidy up its thread
  return ok(res, { id: req.params.id }, 'Launch deleted');
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  toggleUpvote,
  deleteProduct,
};
