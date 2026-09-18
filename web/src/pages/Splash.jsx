import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import FamilyTreeGraphic from '@/components/mobile/FamilyTreeGraphic';
import Button from '@/components/ui/Button';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <MobileScreen bodyClassName="splash-screen">
      <div className="splash-page">
        <header className="splash-page__brand">
          <HeartLogo
            className="splash-page__logo"
            alt=""
            style={{ width: '2.75rem', height: '2.75rem' }}
          />
          <p className="splash-page__wordmark">Aymm</p>
          <p className="splash-page__subtitle">Are You My Mother?</p>
        </header>

        <div className="splash-page__spacer" aria-hidden="true" />

        <div className="splash-page__middle">
          <p className="splash-tagline">Build the family you always dreamed of</p>
          <FamilyTreeGraphic />
        </div>

        <div className="splash-page__spacer" aria-hidden="true" />

        <div className="splash-actions">
          <Button onClick={() => navigate('/Welcome')}>Get Started</Button>
          <p className="splash-caption">A safe place for meaningful family bonds</p>
        </div>
      </div>
    </MobileScreen>
  );
}
