import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import SplashBrand from '@/components/mobile/SplashBrand';
import FamilyTreeGraphic from '@/components/mobile/FamilyTreeGraphic';
import Button from '@/components/ui/Button';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--center screen-pad--between">
        <div className="screen-pad screen-pad--center" style={{ padding: 0, gap: '3rem' }}>
          <SplashBrand />
          <p className="splash-tagline">Build the family you always dreamed of</p>
          <FamilyTreeGraphic />
        </div>

        <div className="splash-actions">
          <Button onClick={() => navigate('/Welcome')}>Get Started</Button>
          <p className="splash-caption">A safe place for meaningful family bonds</p>
        </div>
      </div>
    </MobileScreen>
  );
}
