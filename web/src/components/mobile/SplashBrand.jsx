import HeartLogo from '@/components/brand/HeartLogo';

export default function SplashBrand({ compact = false }) {
  return (
    <div className={`splash-brand${compact ? ' splash-brand--compact' : ''}`}>
      <HeartLogo className={compact ? 'splash-brand__logo-compact' : 'splash-brand__logo'} />
      <p className={compact ? 'splash-brand__wordmark-compact' : 'splash-brand__wordmark'}>Aymm</p>
      <p className="splash-brand__subtitle">Are You My Mother?</p>
    </div>
  );
}
