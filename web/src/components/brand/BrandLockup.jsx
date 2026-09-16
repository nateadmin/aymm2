import HeartLogo from './HeartLogo';

export default function BrandLockup({
  large = false,
  compact = false,
  showSubtitle = true,
  subtitle = 'Find your family tree with simple interactive card stories.',
}) {
  return (
    <div className={`brand-lockup${large ? ' brand-lockup--large' : ''}${compact ? ' brand-lockup--compact' : ''}`}>
      <HeartLogo className="brand-lockup__logo" />
      <div>
        <p className={`aymm-brand-wordmark${large ? ' aymm-brand-wordmark--splash' : ''}`}>Aymm</p>
        {showSubtitle ? <p className="brand-lockup__subtitle">{subtitle}</p> : null}
      </div>
    </div>
  );
}
