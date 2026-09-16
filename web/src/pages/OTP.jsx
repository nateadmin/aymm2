import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/toast';

export default function OTP() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.trim().length < 6) {
      push('Enter the 6-digit code.', 'error');
      return;
    }
    push('Phone verification is not live yet. Use email sign in for now.', 'error');
    navigate('/EmailLogin');
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--auth">
        <BackButton to="/PhoneLogin" />

        <div>
          <h1 className="auth-heading">Enter verification code</h1>
          <p className="auth-subheading">We sent a 6-digit code to your phone.</p>
        </div>

        <label className="auth-field">
          <span className="auth-field__label">Verification code</span>
          <input
            className="aymm-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            placeholder="000000"
          />
        </label>

        <Button
          variant={code.length === 6 ? 'primary' : 'disabled'}
          disabled={code.length !== 6}
          onClick={handleVerify}
        >
          Verify code
        </Button>

        <button type="button" className="screen-back" onClick={() => navigate('/PhoneLogin')}>
          Resend code
        </button>
      </div>
    </MobileScreen>
  );
}
