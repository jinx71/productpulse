import { forwardRef } from 'react';

const Textarea = forwardRef(
  ({ label, error, hint, id, rows = 4, className = '', ...rest }, ref) => {
    const inputId = id || rest.name;
    const describedBy = error
      ? `${inputId}-error`
      : hint
      ? `${inputId}-hint`
      : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={[
            'w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900',
            'placeholder:text-ink-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-coral-400',
            error ? 'border-red-400' : 'border-ink-200',
            className,
          ].join(' ')}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
