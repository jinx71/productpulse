import { useState } from 'react';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import Button from './Button';
import useAuth from '../hooks/useAuth';
import { addComment, deleteComment } from '../api/comments';
import { fromNow } from '../utils/formatDate';

const MAX_LEN = 500;

// A small controlled form used both for top-level comments and inline replies.
export const CommentForm = ({
  productId,
  parentId = null,
  onPosted,
  onCancel,
  autoFocus = false,
  placeholder = 'Share your thoughts…',
}) => {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const text = body.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await addComment(productId, { body: text, parent: parentId || undefined });
      setBody('');
      toast.success(parentId ? 'Reply posted' : 'Comment posted');
      if (onPosted) onPosted();
      if (onCancel) onCancel();
    } catch (err) {
      toast.error(err.message || 'Could not post your comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <textarea
        rows={parentId ? 2 : 3}
        value={body}
        autoFocus={autoFocus}
        maxLength={MAX_LEN}
        placeholder={placeholder}
        onChange={(e) => setBody(e.target.value)}
        className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs tabular-nums text-ink-400">
          {body.length}/{MAX_LEN}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={submit}
            loading={submitting}
            disabled={!body.trim()}
          >
            {parentId ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// One comment plus its nested replies (recursive).
const CommentItem = ({ comment, productId, onChanged }) => {
  const { user, isAuthenticated } = useAuth();
  const [replying, setReplying] = useState(false);

  const isAuthor = isAuthenticated && user && comment.author.id === user.id;

  const remove = async () => {
    if (!window.confirm('Delete this comment and its direct replies?')) return;
    try {
      await deleteComment(comment.id);
      toast.success('Comment deleted');
      onChanged();
    } catch (err) {
      toast.error(err.message || 'Could not delete comment');
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar
        name={comment.author.name}
        color={comment.author.avatarColor}
        size={32}
      />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-ink-50 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <span className="font-medium text-ink-700">{comment.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{fromNow(comment.createdAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink-800">
            {comment.body}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-3 px-1 text-xs">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="font-medium text-ink-500 hover:text-coral-600"
            >
              Reply
            </button>
          )}
          {isAuthor && (
            <button
              type="button"
              onClick={remove}
              className="font-medium text-ink-400 hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2">
            <CommentForm
              productId={productId}
              parentId={comment.id}
              autoFocus
              placeholder={`Reply to ${comment.author.name}…`}
              onPosted={onChanged}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-ink-100 pl-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                productId={productId}
                onChanged={onChanged}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Renders the list of root comments. After any add/delete we call onChanged so
// the parent refetches the whole tree — simplest reliable source of truth.
const CommentThread = ({ comments, productId, onChanged }) => (
  <div className="space-y-5">
    {comments.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        productId={productId}
        onChanged={onChanged}
      />
    ))}
  </div>
);

export default CommentThread;
