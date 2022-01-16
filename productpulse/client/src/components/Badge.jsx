const Badge = ({ children, className = '' }) => (
  <span
    className={[
      'inline-flex items-center rounded-full bg-coral-50 px-2.5 py-0.5',
      'text-xs font-medium text-coral-700 ring-1 ring-inset ring-coral-100',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
