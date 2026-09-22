export default function FamilyTreeGraphic({ className = '' }) {
  return (
    <svg
      viewBox="0 10 280 140"
      width="280"
      height="140"
      className={`splash-family-graphic${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <circle cx="70" cy="50" r="28" stroke="var(--aymm-purple)" strokeWidth="2" fill="none" />
      <circle cx="210" cy="50" r="28" stroke="var(--aymm-purple)" strokeWidth="2" fill="none" />
      <circle cx="140" cy="120" r="28" stroke="var(--aymm-red)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M98 78 L122 98" stroke="var(--aymm-red)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      <path d="M182 78 L158 98" stroke="var(--aymm-red)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      <path d="M112 50 H168" stroke="var(--aymm-purple)" strokeWidth="1.5" fill="none" />
      <path d="M58 36 L82 18" stroke="var(--aymm-purple)" strokeWidth="1.5" fill="none" />
      <path d="M222 36 L198 18" stroke="var(--aymm-purple)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
