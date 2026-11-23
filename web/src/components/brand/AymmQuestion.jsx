const VARIANT_CLASS = {
  inline: 'aymm-brand-wordmark--inline',
  button: 'aymm-brand-wordmark--button',
  hero: 'aymm-brand-wordmark--hero',
};

/** Brand-styled "AYMM?" / "AYMF?" label for buttons and headlines. */
export default function AymmQuestion({ variant = 'inline', brand = 'aymm', className = '' }) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.inline;
  const text = brand === 'aymf' ? 'AYMF?' : 'AYMM?';
  return (
    <span className={`aymm-brand-wordmark ${variantClass}${className ? ` ${className}` : ''}`}>
      {text}
    </span>
  );
}
