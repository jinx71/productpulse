require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Comment = require('./models/Comment');

const HOUR = 60 * 60 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR);

// Fabricate N upvoter ids (we only count them / check membership, so they
// don't need to be real user documents). The demo users below are real.
const fakeVotes = (n) =>
  Array.from({ length: n }, () => new mongoose.Types.ObjectId());

// name, tagline, category, ageHours, votes
const LAUNCHES = [
  ['Lumen', 'Beautiful dashboards without writing SQL', 'Developer Tools', 2, 38],
  ['Hearth', 'A calmer place for team standups', 'Productivity', 1, 12],
  ['Nimbus', 'Edge functions for the rest of us', 'Developer Tools', 0.5, 6],
  ['Quill AI', 'Turn meeting notes into action items', 'AI', 5, 64],
  ['Sprout', 'Habit tracking that actually sticks', 'Health', 3, 41],
  ['Palette', 'Accessible color systems in one click', 'Design', 9, 95],
  ['Cohort', 'Privacy-first product analytics', 'AI', 12, 88],
  ['Orbit', 'A lightweight CRM for indie founders', 'Marketing', 30, 120],
  ['Cobalt', 'Self-hosted feature flags for teams', 'Developer Tools', 26, 210],
  ['Pixelpush', 'Ship pixel-perfect emails fast', 'Marketing', 75, 150],
  ['Ledgerly', 'Personal finance that respects your privacy', 'Finance', 50, 180],
  ['Folio', 'A portfolio builder for developers', 'Design', 96, 240],
];

const longDescription = (name, tagline) =>
  `${name} is ${tagline.toLowerCase()}. Built for small teams who want to move fast ` +
  `without drowning in setup. This is seeded demo data for ProductPulse — sign in ` +
  `with the demo account to upvote, comment, and submit your own launch. Try the ` +
  `Trending / Top / Newest tabs to watch the ranking algorithm reorder this feed.`;

const seed = async () => {
  await connectDB();

  console.log('… clearing existing data');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  console.log('… creating demo users');
  // .create() runs the pre-save hook so these passwords get hashed.
  const demo = await User.create({
    name: 'Demo User',
    email: 'demo@productpulse.dev',
    password: 'password123',
    avatarColor: '#FF6B5C',
  });
  const maya = await User.create({
    name: 'Maya Byrne',
    email: 'maya@productpulse.dev',
    password: 'password123',
    avatarColor: '#6366F1',
  });
  const sean = await User.create({
    name: 'Seán Walsh',
    email: 'sean@productpulse.dev',
    password: 'password123',
    avatarColor: '#10B981',
  });
  const submitters = [demo, maya, sean];

  console.log('… creating launches');
  const docs = LAUNCHES.map(([name, tagline, category, ageHours, votes], i) => ({
    name,
    tagline,
    description: longDescription(name, tagline),
    url: `https://example.com/${name.toLowerCase().replace(/\s+/g, '-')}`,
    imageUrl: '', // client renders a coral gradient placeholder from the name
    category,
    upvotes: fakeVotes(votes),
    submittedBy: submitters[i % submitters.length]._id,
    createdAt: ago(ageHours),
    updatedAt: ago(ageHours),
  }));

  // insertMany with timestamps:true still respects our explicit createdAt.
  const inserted = await Product.insertMany(docs, { timestamps: false });

  console.log('… adding a sample comment thread');
  const target = inserted.find((p) => p.name === 'Quill AI');
  const root = await Comment.create({
    product: target._id,
    author: maya._id,
    body: 'The action-item extraction is genuinely useful. Does it integrate with calendars?',
  });
  await Comment.create({
    product: target._id,
    author: sean._id,
    body: 'Same question — would love Google Calendar sync.',
    parent: root._id,
  });
  await Comment.create({
    product: target._id,
    author: demo._id,
    body: 'Trying this on our standups this week. Clean UI.',
  });

  console.log('\n✓ Seed complete');
  console.log(`  Users:    ${submitters.length}`);
  console.log(`  Launches: ${inserted.length}`);
  console.log('\n  Demo login →  demo@productpulse.dev  /  password123\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error('✗ Seed failed:', err);
  await mongoose.connection.close();
  process.exit(1);
});
