import Button from './Button';

// Shown when an async view fails. Offers a retry when a handler is provided.
const ErrorState = ({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center">
    <div className="mb-3 text-4xl" aria-hidden="true">
      ⚠️
    </div>
    <h3 className="font-display text-lg font-semibold text-ink-800">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-ink-600">{message}</p>
    {onRetry && (
      <Button variant="secondary" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
