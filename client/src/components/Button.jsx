import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'bg-coral-500 text-white hover:bg-coral-600 focus-visible:ring-coral-400 shadow-soft',
  secondary:
    'bg-white text-ink-800 border border-ink-200 hover:bg-ink-50 focus-visible:ring-coral-400',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 focus-visible:ring-coral-400',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 shadow-soft',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

// `as` lets us render the same styles as a <button> (default) or a router
// <Link> / <a>. We only forward `disabled` to a real button element.
const Button = ({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
  ].join(' ');

  const buttonOnlyProps =
    Comp === 'button' ? { disabled: disabled || loading, type: rest.type || 'button' } : {};

  return (
    <Comp className={classes} {...buttonOnlyProps} {...rest}>
      {loading && <Spinner size="sm" />}
      {children}
    </Comp>
  );
};

export default Button;
