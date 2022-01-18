// Shown when an async view succeeds but has nothing to display.
const EmptyState = ({ title = 'Nothing here yet', message, icon, children }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
    <div className="mb-3 text-4xl" aria-hidden="true">
      {icon || '🌱'}
    </div>
    <h3 className="font-display text-lg font-semibold text-ink-800">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-ink-500">{message}</p>}
    {children && <div className="mt-5">{children}</div>}
  </div>
);

export default EmptyState;
