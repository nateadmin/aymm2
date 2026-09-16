import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import SplashBrand from '@/components/mobile/SplashBrand';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { isMockAuthEnabled } from '@/lib/mockAuth';

export default function EmailRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const mockAuth = isMockAuthEnabled();

  const canSubmit = email.trim() && password.trim().length >= 8;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      navigate('/ProfileSetup/upload-photo', { replace: true });
    } catch (error) {
      const message = error.payload?.error === 'email_taken'
        ? 'That email is already registered.'
        : 'Could not create your account. Use an 8+ character password.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileScreen>
      <form className="screen-pad screen-pad--auth" onSubmit={handleSubmit}>
        <BackButton to="/demo" />

        <div className="screen-pad screen-pad--center" style={{ padding: 0 }}>
          <SplashBrand compact />
          <h1 className="auth-heading">Create account</h1>
          <p className="auth-subheading">Start your profile in a few steps</p>
        </div>

        <div className="auth-stack">
          <label className="auth-field">
            <span className="auth-field__label">Email address</span>
            <input
              className="aymm-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Password</span>
            <div className="auth-field__input-wrap">
              <input
                className="aymm-input"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <EyeOff
                size={18}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--aymm-warm-gray)',
                }}
              />
            </div>
          </label>

          {mockAuth ? (
            <p className="auth-demo-hint">Demo mode: any valid email works in StackBlitz.</p>
          ) : null}
        </div>

        <Button
          type="submit"
          variant={canSubmit ? 'primary' : 'disabled'}
          disabled={!canSubmit || submitting}
        >
          Continue to profile setup
        </Button>
      </form>
    </MobileScreen>
  );
}
