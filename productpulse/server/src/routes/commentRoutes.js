const express = require('express');
const { body } = require('express-validator');
const {
  listComments,
  addComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const commentRules = [
  body('body').trim().notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 500 }).withMessage('Comment must be at most 500 characters'),
  body('parent').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid parent id'),
];

router
  .route('/product/:productId')
  .get(listComments)
  .post(protect, commentRules, addComment);

router.delete('/:id', protect, deleteComment);

module.exports = router;
