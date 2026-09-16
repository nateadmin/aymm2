import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function CreatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const { push } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetState = location.state || {};
  const canSubmit = password.length >= 8 && password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    if (!resetState.email && !resetState.phone) {
      push('Start from the reset password screen.', 'error');
      navigate('/ForgotPassword', { replace: true });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        email: resetState.email,
        phone: resetState.phone,
        password,
        code: resetState.code,
      });
      push('Password updated. Sign in with your new password.', 'success');
      navigate('/EmailLogin', { replace: true });
    } catch (error) {
      const message = error.payload?.error === 'password_required'
        ? 'Use at least 8 characters.'
        : 'Could not update your password. Try again.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileScreen>
      <form className="screen-pad screen-pad--auth" onSubmit={handleSubmit}>
        <BackButton to="/ForgotPassword" />

        <div>
          <h1 className="auth-heading auth-heading--brand">Create Password</h1>
          <p className="auth-subheading">Make it strong and memorable</p>
        </div>

        <div className="auth-stack">
          <label className="auth-field">
            <span className="auth-field__label">Password</span>
            <div className="auth-field__input-wrap">
              <input
                className="aymm-input"
                type="password"
                name="password"
                placeholder="Enter password"
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

          <label className="auth-field">
            <span className="auth-field__label">Confirm Password</span>
            <input
              className="aymm-input"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>

        <Button
          type="submit"
          variant={canSubmit ? 'primary' : 'disabled'}
          disabled={!canSubmit || submitting}
        >
          Set Password
        </Button>
      </form>
    </MobileScreen>
  );
}
