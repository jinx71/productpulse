// Loading placeholder that mirrors ProductCard's layout so the feed doesn't
// jump when real data arrives. `.shimmer` is defined in index.css.
const SkeletonCard = () => (
  <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4">
    <div className="h-14 w-14 shrink-0 rounded-xl shimmer" />
    <div className="min-w-0 flex-1">
      <div className="h-4 w-2/5 rounded shimmer" />
      <div className="mt-2 h-3 w-4/5 rounded shimmer" />
      <div className="mt-3 h-3 w-1/4 rounded shimmer" />
    </div>
    <div className="h-16 w-14 shrink-0 rounded-xl shimmer" />
  </div>
);

export default SkeletonCard;
