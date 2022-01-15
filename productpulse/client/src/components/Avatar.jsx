import { getInitials } from '../utils/avatar';

const SIZES = {
  sm: 28,
  md: 36,
  lg: 48,
};

// A colored initials circle. Color comes from the user's avatarColor; size is
// applied inline so it works at any scale without extra Tailwind classes.
const Avatar = ({ name, color = '#FF6B5C', size = 'md', className = '' }) => {
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        backgroundColor: color,
        width: px,
        height: px,
        fontSize: px * 0.4,
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;
