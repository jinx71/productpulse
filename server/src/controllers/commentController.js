const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created, fail } = require('../utils/apiResponse');

const shapeComment = (c) => ({
  id: c._id,
  body: c.body,
  parent: c.parent,
  createdAt: c.createdAt,
  author: c.author
    ? { id: c.author._id, name: c.author.name, avatarColor: c.author.avatarColor }
    : { id: null, name: '[deleted]', avatarColor: '#9CA3AF' },
  replies: [],
});

// Turn a flat list of comments into a nested tree using the `parent` ref.
// O(n): one pass to index every node, one pass to attach each to its parent.
const buildTree = (comments) => {
  const byId = new Map();
  const roots = [];

  comments.forEach((c) => byId.set(c.id.toString(), c));

  comments.forEach((c) => {
    if (c.parent && byId.has(c.parent.toString())) {
      byId.get(c.parent.toString()).replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
};

// GET /api/comments/product/:productId
const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ product: req.params.productId })
    .populate('author', 'name avatarColor')
    .sort({ createdAt: 1 })
    .lean(); // lean docs — we only read + reshape them

  const shaped = comments.map(shapeComment);
  const tree = buildTree(shaped);

  return ok(res, { comments: tree, count: comments.length });
});

// POST /api/comments/product/:productId  (protected)
const addComment = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, 'Validation failed', 422, result.array());
  }

  const product = await Product.findById(req.params.productId).select('_id');
  if (!product) return fail(res, 'Product not found', 404);

  const { body, parent } = req.body;

  // If replying, make sure the parent exists and belongs to this product.
  if (parent) {
    const parentComment = await Comment.findById(parent).select('product');
    if (!parentComment || parentComment.product.toString() !== product._id.toString()) {
      return fail(res, 'Parent comment not found for this product', 400);
    }
  }

  let comment = await Comment.create({
    product: product._id,
    author: req.user._id,
    body,
    parent: parent || null,
  });
  comment = await comment.populate('author', 'name avatarColor');

  return created(res, { comment: shapeComment(comment.toObject()) }, 'Comment posted');
});

// DELETE /api/comments/:id  (protected, author only)
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return fail(res, 'Comment not found', 404);

  if (comment.author.toString() !== req.user._id.toString()) {
    return fail(res, 'You can only delete your own comments', 403);
  }

  // Soft-ish cascade: drop this comment and any direct replies to it.
  await Comment.deleteMany({ $or: [{ _id: comment._id }, { parent: comment._id }] });
  return ok(res, { id: req.params.id }, 'Comment deleted');
});

module.exports = { listComments, addComment, deleteComment };
