import Spinner from './Spinner';

// Purely presentational. State + the optimistic toggle live in useVote; this
// just renders the current count/voted/pending and reports clicks.
const UpvoteButton = ({ count, hasVoted, pending, onClick, size = 'md' }) => {
  const big = size === 'lg';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={hasVoted}
      aria-label={hasVoted ? 'Remove your upvote' : 'Upvote this launch'}
      className={[
        'group flex shrink-0 flex-col items-center justify-center rounded-xl border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2',
        big ? 'h-20 w-16' : 'h-16 w-14',
        hasVoted
          ? 'border-coral-300 bg-coral-50 text-coral-600'
          : 'border-ink-200 bg-white text-ink-500 hover:border-coral-300 hover:text-coral-500',
      ].join(' ')}
    >
      {pending ? (
        <Spinner size="sm" />
      ) : (
        <svg
          className={[
            'transition-transform duration-150',
            big ? 'h-5 w-5' : 'h-4 w-4',
            hasVoted ? '-translate-y-0.5' : 'group-hover:-translate-y-0.5',
          ].join(' ')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 3.5 17 12H3z" />
        </svg>
      )}
      <span
        className={`mt-1 font-semibold tabular-nums ${big ? 'text-base' : 'text-sm'}`}
      >
        {count}
      </span>
    </button>
  );
};

export default UpvoteButton;
