import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import SplashBrand from '@/components/mobile/SplashBrand';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { getPostAuthPath } from '@/lib/session';

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, hasProfile, profile } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getPostAuthPath({ hasProfile, profile }), { replace: true });
    }
  }, [isAuthenticated, hasProfile, profile, navigate]);

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--center screen-pad--between">
        <div className="screen-pad screen-pad--center" style={{ padding: 0 }}>
          <SplashBrand compact />
          <h1 className="welcome-home-title">welcome home</h1>
          <p className="welcome-copy">
            Thousands of people have found the family they always hoped for.
          </p>
        </div>

        <div className="splash-actions">
          <Button onClick={() => navigate('/Register')}>Create Account</Button>
          <Button variant="outline" onClick={() => navigate('/Login')}>Log In</Button>
          <p className="welcome-legal">
            By continuing you agree to our{' '}
            <Link to="/PrivacyPolicy">Terms &amp; Privacy Policy</Link>
          </p>
        </div>
      </div>
    </MobileScreen>
  );
}
