const mongoose = require('mongoose');

const CATEGORIES = [
  'Developer Tools',
  'Productivity',
  'AI',
  'Design',
  'Marketing',
  'Finance',
  'Health',
  'Social',
  'Other',
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name must be at most 80 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
      maxlength: [120, 'Tagline must be at most 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description must be at most 2000 characters'],
    },
    url: {
      type: String,
      required: [true, 'A website URL is required'],
      trim: true,
      match: [/^https?:\/\/.+/i, 'URL must start with http:// or https://'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Other',
    },
    // We store the *set of users* who upvoted rather than a bare counter.
    // This makes "has the current user voted?" trivial and prevents double
    // votes at the data layer (toggle = add/remove from this array).
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Derived count — kept out of the stored document so it can never disagree
// with the upvotes array.
productSchema.virtual('voteCount').get(function voteCount() {
  return this.upvotes ? this.upvotes.length : 0;
});

// Simple text search across name + tagline for the feed search box.
productSchema.index({ name: 'text', tagline: 'text' });

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
