export default function FamilyTreeGraphic({ className = 'splash-family-graphic' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="70" cy="50" r="28" stroke="#3F214D" strokeWidth="2" />
      <circle cx="210" cy="50" r="28" stroke="#3F214D" strokeWidth="2" />
      <circle cx="140" cy="120" r="28" stroke="#FE5658" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M98 78 L122 98" stroke="#FE5658" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M182 78 L158 98" stroke="#FE5658" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M112 50 H168" stroke="#3F214D" strokeWidth="1.5" />
      <path d="M58 36 L82 18" stroke="#3F214D" strokeWidth="1.5" />
      <path d="M222 36 L198 18" stroke="#3F214D" strokeWidth="1.5" />
    </svg>
  );
}
