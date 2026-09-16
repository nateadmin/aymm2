import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const { push } = useToast();
  const [channel, setChannel] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = channel === 'email' ? isValidEmail(email) : phone.trim().length >= 7;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await requestPasswordReset({
        channel,
        email: channel === 'email' ? email.trim().toLowerCase() : undefined,
        phone: channel === 'phone' ? phone.trim() : undefined,
      });
      navigate('/OTP', {
        replace: true,
        state: {
          flow: 'reset',
          channel,
          email: channel === 'email' ? email.trim().toLowerCase() : undefined,
          phone: channel === 'phone' ? phone.trim() : undefined,
        },
      });
    } catch (error) {
      const message = error.payload?.error === 'email_required'
        ? 'Enter a valid email address.'
        : 'Could not send reset link. Please try again.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileScreen>
      <form className="screen-pad screen-pad--auth" onSubmit={handleSubmit}>
        <BackButton to="/EmailLogin" />

        <div>
          <h1 className="auth-heading auth-heading--brand">Reset Password</h1>
          <p className="auth-subheading">How would you like to receive your reset link?</p>
        </div>

        <div className="auth-segment" role="tablist" aria-label="Reset channel">
          <button
            type="button"
            role="tab"
            aria-selected={channel === 'email'}
            className={`auth-segment__option${channel === 'email' ? ' auth-segment__option--active' : ''}`}
            onClick={() => setChannel('email')}
          >
            Email
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={channel === 'phone'}
            className={`auth-segment__option${channel === 'phone' ? ' auth-segment__option--active' : ''}`}
            onClick={() => setChannel('phone')}
          >
            Phone
          </button>
        </div>

        <div className="auth-stack">
          {channel === 'email' ? (
            <label className="auth-field">
              <span className="auth-field__label">Email Address</span>
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
          ) : (
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
                  autoComplete="tel"
                />
              </div>
            </label>
          )}
        </div>

        <Button
          type="submit"
          variant={canSubmit ? 'primary' : 'disabled'}
          disabled={!canSubmit || submitting}
        >
          Send Reset Link
        </Button>
      </form>
    </MobileScreen>
  );
}
