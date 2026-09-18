const VARIANT_CLASS = {
  inline: 'aymm-brand-wordmark--inline',
  button: 'aymm-brand-wordmark--button',
  hero: 'aymm-brand-wordmark--hero',
};

/** Brand-styled "AYMM?" label for buttons and headlines. */
export default function AymmQuestion({ variant = 'inline', className = '' }) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.inline;
  return (
    <span className={`aymm-brand-wordmark ${variantClass}${className ? ` ${className}` : ''}`}>
      AYMM?
    </span>
  );
}
