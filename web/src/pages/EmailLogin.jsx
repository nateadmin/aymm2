import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function EmailLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim() && password.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const session = await login(email.trim(), password);
      navigate(session?.hasProfile ? '/Home' : '/ProfileSetup/upload-photo', { replace: true });
    } catch (error) {
      const message = error.payload?.error === 'invalid_credentials'
        ? 'Email or password is incorrect.'
        : 'Could not sign in. Please try again.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileScreen>
      <form className="screen-pad screen-pad--auth" onSubmit={handleSubmit}>
        <BackButton to="/Login" />

        <div>
          <h1 className="auth-heading">Sign in</h1>
          <p className="auth-subheading">Enter your details below</p>
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
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
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

          <button type="button" className="auth-link">Forgot Password?</button>
        </div>

        <Button
          type="submit"
          variant={canSubmit ? 'primary' : 'disabled'}
          disabled={!canSubmit || submitting}
        >
          Sign In
        </Button>
      </form>
    </MobileScreen>
  );
}
