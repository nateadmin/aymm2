/** Brand-styled "AYMM?" label for buttons and headlines. */
export default function AymmQuestion({ className = '' }) {
  return (
    <span className={`aymm-brand-wordmark aymm-brand-wordmark--inline${className ? ` ${className}` : ''}`}>
      AYMM?
    </span>
  );
}
