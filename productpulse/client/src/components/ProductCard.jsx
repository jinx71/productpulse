import { Link } from 'react-router-dom';
import Badge from './Badge';
import Avatar from './Avatar';
import GradientThumb from './GradientThumb';
import UpvoteButton from './UpvoteButton';
import useVote from '../hooks/useVote';
import { fromNow } from '../utils/formatDate';

// One row in the feed. Each card owns its own vote state via useVote, so an
// upvote here updates instantly without re-rendering the whole list.
const ProductCard = ({ product, rank }) => {
  const { count, hasVoted, pending, toggle } = useVote(
    product.id,
    product.voteCount,
    product.hasVoted
  );

  const submitter = product.submittedBy;

  return (
    <div className="relative flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 transition-shadow hover:shadow-soft">
      {/* Rank badge — the signature motif: this app is a ranking. */}
      {rank != null && (
        <span className="absolute -left-2 -top-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-ink-900 px-1.5 text-xs font-bold text-white shadow-soft">
          {rank}
        </span>
      )}

      <Link to={`/launch/${product.id}`} className="shrink-0">
        <GradientThumb name={product.name} size="md" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            to={`/launch/${product.id}`}
            className="truncate font-display text-base font-semibold text-ink-900 hover:text-coral-600"
          >
            {product.name}
          </Link>
          <Badge>{product.category}</Badge>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-ink-600">{product.tagline}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-ink-400">
          {submitter && (
            <>
              <Avatar name={submitter.name} color={submitter.avatarColor} size={20} />
              <span className="text-ink-500">{submitter.name}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{fromNow(product.createdAt)}</span>
        </div>
      </div>

      <UpvoteButton
        count={count}
        hasVoted={hasVoted}
        pending={pending}
        onClick={toggle}
      />
    </div>
  );
};

export default ProductCard;
