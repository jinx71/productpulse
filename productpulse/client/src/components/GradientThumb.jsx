// A deterministic gradient thumbnail derived from the product name. We render
// this instead of hotlinking external images — it keeps the console clean (no
// broken-image requests), always looks on-brand, and needs zero network calls.
// Hues are pinned to the warm/coral family so thumbnails feel cohesive.

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }
  return Math.abs(hash);
};

const SIZES = {
  sm: 'h-12 w-12 text-base',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-3xl',
};

const GradientThumb = ({ name = '?', size = 'md', className = '' }) => {
  const hash = hashString(name);
  // Warm band only: hue 6–38 (reds → oranges → ambers).
  const hueA = 6 + (hash % 32);
  const hueB = (hueA + 18) % 360;
  const letter = (name.trim()[0] || '?').toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-display font-bold text-white shadow-soft ${
        SIZES[size] || SIZES.md
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hueA} 90% 62%), hsl(${hueB} 85% 52%))`,
      }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
};

export default GradientThumb;
