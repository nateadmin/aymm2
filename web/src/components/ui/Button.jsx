const VARIANTS = {
  primary: 'aymm-button--primary',
  outline: 'aymm-button--outline',
  purple: 'aymm-button--purple',
  ghost: 'aymm-button--ghost',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`aymm-button ${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
