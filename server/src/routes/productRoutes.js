const express = require('express');
const { body } = require('express-validator');
const {
  listProducts,
  getProduct,
  createProduct,
  toggleUpvote,
  deleteProduct,
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { CATEGORIES } = require('../models/Product');

const router = express.Router();

const createRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 80 }).withMessage('Name must be at most 80 characters'),
  body('tagline').trim().notEmpty().withMessage('Tagline is required')
    .isLength({ max: 120 }).withMessage('Tagline must be at most 120 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
  body('url').trim().matches(/^https?:\/\/.+/i).withMessage('URL must start with http:// or https://'),
  body('imageUrl').optional({ checkFalsy: true }).trim()
    .matches(/^https?:\/\/.+/i).withMessage('Image URL must start with http:// or https://'),
  body('category').optional().isIn(CATEGORIES).withMessage('Unknown category'),
];

router
  .route('/')
  .get(optionalAuth, listProducts)
  .post(protect, createRules, createProduct);

router.post('/:id/upvote', protect, toggleUpvote);

router
  .route('/:id')
  .get(optionalAuth, getProduct)
  .delete(protect, deleteProduct);

module.exports = router;
