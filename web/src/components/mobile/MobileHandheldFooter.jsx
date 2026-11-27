/**
 * Pinned bottom CTA region on handheld screens (safe-area + footer chrome).
 * Use on screen-pad--handheld layouts instead of placing Button as a direct child.
 */
export default function MobileHandheldFooter({
  children,
  className = '',
  variant = 'onboarding',
}) {
  if (children == null) return null;

  const variantClass = variant === 'connection'
    ? 'connection-success__actions'
    : 'mobile-onboarding__actions';

  return (
    <div className={[variantClass, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}