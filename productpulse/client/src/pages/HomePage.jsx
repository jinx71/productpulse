import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { CATEGORIES } from '../utils/categories';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';

const SORTS = [
  { key: 'trending', label: 'Trending' },
  { key: 'newest', label: 'Newest' },
  { key: 'top', label: 'Top' },
];

const PAGE_SIZE = 8;

const HomePage = () => {
  const [sort, setSort] = useState('trending');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState(''); // debounced search term sent to the API

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [loadingMore, setLoadingMore] = useState(false);

  // Each request gets an id; we ignore any response that isn't the latest, so
  // fast filter/sort changes can't render stale data out of order.
  const reqId = useRef(0);

  // Debounce the search box -> q.
  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadFirst = useCallback(async () => {
    const id = (reqId.current += 1);
    setStatus('loading');
    try {
      const data = await fetchProducts({
        sort,
        category,
        q: q || undefined,
        page: 1,
        limit: PAGE_SIZE,
      });
      if (id !== reqId.current) return; // a newer request superseded this one
      setItems(data.products);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setStatus('ready');
    } catch (err) {
      if (id !== reqId.current) return;
      setStatus('error');
    }
  }, [sort, category, q]);

  // Reload the first page whenever the sort, category, or search changes.
  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    const id = reqId.current; // keep the same id; appends only if still current
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await fetchProducts({
        sort,
        category,
        q: q || undefined,
        page: next,
        limit: PAGE_SIZE,
      });
      if (id !== reqId.current) return;
      setItems((prev) => [...prev, ...data.products]);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      // Non-fatal: keep what we have, the button stays for a retry.
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Today&apos;s launches
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {sort === 'trending'
            ? 'Ranked by votes \u00F7 age — fresh launches with momentum rise to the top.'
            : sort === 'newest'
            ? 'The most recently submitted launches.'
            : 'All-time most upvoted launches.'}
        </p>
      </div>

      {/* Sort tabs */}
      <div className="mb-4 inline-flex rounded-xl border border-ink-200 bg-white p-1">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSort(s.key)}
            className={[
              'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
              sort === s.key
                ? 'bg-coral-500 text-white shadow-soft'
                : 'text-ink-600 hover:bg-ink-50',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search launches…"
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400"
        />
      </div>

      {/* Category pills */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={[
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              category === cat
                ? 'bg-ink-900 text-white'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Body */}
      {status === 'loading' && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          title="Couldn't load launches"
          message="The server may be offline. Check that it's running and try again."
          onRetry={loadFirst}
        />
      )}

      {status === 'ready' && items.length === 0 && (
        <EmptyState
          title="No launches found"
          message={
            q || category !== 'All'
              ? 'Try a different search or category.'
              : 'Be the first to put something on the board.'
          }
        >
          <Button as={Link} to="/submit">
            Submit the first launch
          </Button>
        </EmptyState>
      )}

      {status === 'ready' && items.length > 0 && (
        <>
          <div className="space-y-3">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            {page < totalPages ? (
              <Button
                variant="secondary"
                onClick={loadMore}
                loading={loadingMore}
              >
                Load more
              </Button>
            ) : (
              <p className="text-sm text-ink-400">
                That&apos;s all {total} launch{total === 1 ? '' : 'es'}.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
