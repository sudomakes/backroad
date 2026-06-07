// Decorative geometric mark. Three nested squares in the brand glyph's
// vocabulary, scaled to feel like a corner stamp.
export function GridMark({
  size = 56,
  opacity = 0.6,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M28 4 L52 28 L28 52 L4 28 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M28 14 L42 28 L28 42 L14 28 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M28 22 L34 28 L28 34 L22 28 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
