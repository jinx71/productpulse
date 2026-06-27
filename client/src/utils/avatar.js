// Up to two uppercase initials from a name, e.g. "Maya Chen" -> "MC".
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const initials = parts.slice(0, 2).map((p) => p[0].toUpperCase());
  return initials.join('');
};
