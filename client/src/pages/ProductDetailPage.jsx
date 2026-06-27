import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProduct, deleteProduct } from '../api/products';
import { fetchComments } from '../api/comments';
import useAuth from '../hooks/useAuth';
import useVote from '../hooks/useVote';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import GradientThumb from '../components/GradientThumb';
import UpvoteButton from '../components/UpvoteButton';
import ErrorState from '../components/ErrorState';
import CommentThread, { CommentForm } from '../components/CommentThread';
import { fromNow, formatDate } from '../utils/formatDate';

// Inner component so we can call useVote with the loaded product's values.
const ProductBody = ({ product, onDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const { count, hasVoted, pending, toggle } = useVote(
    product.id,
    product.voteCount,
    product.hasVoted
  );

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentStatus, setCommentStatus] = useState('loading'); // loading|error|ready
  const [deleting, setDeleting] = useState(false);

  const isOwner =
    isAuthenticated && product.submittedBy && user.id === product.submittedBy.id;

  const loadComments = useCallback(async () => {
    setCommentStatus('loading');
    try {
      const data = await fetchComments(product.id);
      setComments(data.comments);
      setCommentCount(data.count);
      setCommentStatus('ready');
    } catch (err) {
      setCommentStatus('error');
    }
  }, [product.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this launch? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteProduct(product.id);
      toast.success('Launch deleted');
      onDeleted();
    } catch (err) {
      toast.error(err.message || 'Could not delete launch');
      setDeleting(false);
    }
  };

  return (
    <div>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-coral-600"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M12.5 15 7 10l5.5-5v10z" />
        </svg>
        Back to feed
      </Link>

      <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <GradientThumb name={product.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink-900">
                {product.name}
              </h1>
              <Badge>{product.category}</Badge>
            </div>
            <p className="mt-1 text-ink-600">{product.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-400">
              {product.submittedBy && (
                <>
                  <Avatar
                    name={product.submittedBy.name}
                    color={product.submittedBy.avatarColor}
                    size={22}
                  />
                  <span className="text-ink-500">{product.submittedBy.name}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span title={formatDate(product.createdAt)}>
                {fromNow(product.createdAt)}
              </span>
            </div>
          </div>

          <UpvoteButton
            count={count}
            hasVoted={hasVoted}
            pending={pending}
            onClick={toggle}
            size="lg"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            as="a"
            href={product.url}
            target="_blank"
            rel="noreferrer"
            variant="primary"
          >
            Visit website
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M11 3h6v6h-2V6.4l-7.3 7.3-1.4-1.4L13.6 5H11V3z" />
              <path d="M5 5h3v2H5v8h8v-3h2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
            </svg>
          </Button>
          {isOwner && (
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete launch
            </Button>
          )}
        </div>

        <div className="mt-6 border-t border-ink-100 pt-5">
          <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
            About
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
            {product.description}
          </p>
        </div>
      </div>

      {/* Comments */}
      <section className="mt-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink-900">
          Discussion{' '}
          <span className="text-ink-400">
            ({commentStatus === 'ready' ? commentCount : '…'})
          </span>
        </h2>

        {isAuthenticated ? (
          <div className="mb-6">
            <CommentForm productId={product.id} onPosted={loadComments} />
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
            <Link to="/login" className="font-semibold text-coral-600 hover:underline">
              Sign in
            </Link>{' '}
            to join the discussion.
          </div>
        )}

        {commentStatus === 'loading' && (
          <div className="flex justify-center py-8 text-coral-500">
            <Spinner />
          </div>
        )}
        {commentStatus === 'error' && (
          <ErrorState
            title="Couldn't load comments"
            message="Please try again."
            onRetry={loadComments}
          />
        )}
        {commentStatus === 'ready' && comments.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-400">
            No comments yet — start the conversation.
          </p>
        )}
        {commentStatus === 'ready' && comments.length > 0 && (
          <CommentThread
            comments={comments}
            productId={product.id}
            onChanged={loadComments}
          />
        )}
      </section>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchProduct(id);
      setProduct(data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-20 text-coral-500">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <ErrorState
        title="Launch not found"
        message="This launch may have been removed, or the link is wrong."
        onRetry={load}
      />
    );
  }

  // Remount the body when the product id changes so useVote re-seeds cleanly.
  return (
    <ProductBody
      key={product.id}
      product={product}
      onDeleted={() => navigate('/')}
    />
  );
};

export default ProductDetailPage;
