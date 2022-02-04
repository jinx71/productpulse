// Mirrors the server's Product enum. 'All' is the feed's default filter and is
// never sent as a real category to the API.
export const PRODUCT_CATEGORIES = [
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

// For the feed filter bar.
export const CATEGORIES = ['All', ...PRODUCT_CATEGORIES];
