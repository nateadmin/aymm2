import { Link, useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import SplashBrand from '@/components/mobile/SplashBrand';
import Button from '@/components/ui/Button';
import { isMockAuthEnabled, MOCK_LOGIN_EMAIL, MOCK_LOGIN_PASSWORD } from '@/lib/mockAuth';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function Demo() {
  const navigate = useNavigate();
  const mockMode = isMockAuthEnabled();

  return (
    <MobileScreen>
      <div className="screen-pad demo-page">
        <SplashBrand compact />

        <header className="demo-page__header">
          <h1 className="demo-page__title">Try AYMM</h1>
          <p className="demo-page__lead">
            Interactive demo — create an account, walk through profile setup, and land on Home.
            No backend required in StackBlitz.
          </p>
        </header>

        <ol className="demo-page__steps">
          <li>
            <strong>Create account</strong>
            <span>Sign up with any email and an 8+ character password.</span>
          </li>
          <li>
            <strong>Build your profile</strong>
            <span>Upload a photo, add basics, and finish review.</span>
          </li>
          <li>
            <strong>Explore Home</strong>
            <span>Browse demo matches and open the app shell.</span>
          </li>
        </ol>

        <div className="demo-page__actions">
          <Button onClick={() => navigate('/EmailRegister')}>Create account</Button>
          <Button variant="outline" onClick={() => navigate('/EmailLogin')}>
            Sign in
          </Button>
        </div>

        {mockMode ? (
          <p className="demo-page__hint">
            Quick sign-in: <strong>{MOCK_LOGIN_EMAIL}</strong> /{' '}
            <strong>{MOCK_LOGIN_PASSWORD}</strong> (skips profile setup)
          </p>
        ) : null}

        <p className="demo-page__footer">
          <Link to={withPreviewQuery('/screens')}>Browse all screens</Link>
        </p>
      </div>
    </MobileScreen>
  );
}
