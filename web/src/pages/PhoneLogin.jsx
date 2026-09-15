import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';

export default function PhoneLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--auth">
        <BackButton to="/Login" />

        <div>
          <h1 className="auth-heading">Sign in with phone</h1>
          <p className="auth-subheading">We&apos;ll send a verification code to confirm it&apos;s you.</p>
        </div>

        <label className="auth-field">
          <span className="auth-field__label">Phone Number</span>
          <div className="aymm-input" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0 0.875rem', borderRight: '0.8px solid var(--aymm-light-border)', height: '100%' }}>
              <span aria-hidden="true">🇺🇸</span>
              <span>+1</span>
            </div>
            <input
              style={{ border: 0, outline: 'none', flex: 1, minHeight: '3.25rem', background: 'transparent', fontFamily: 'inherit' }}
              type="tel"
              name="phone"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </label>

        <p className="splash-caption" style={{ textAlign: 'left', maxWidth: 'none' }}>
          Standard messaging rates may apply. We never share your number.
        </p>

        <Button
          variant={phone.trim() ? 'primary' : 'disabled'}
          disabled={!phone.trim()}
          onClick={() => navigate('/OTP')}
        >
          Send Code
        </Button>
      </div>
    </MobileScreen>
  );
}
