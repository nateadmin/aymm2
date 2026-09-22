import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthPage from '@/components/mobile/AuthPage';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/toast';

const CODE_LENGTH = 6;

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();
  const resetState = location.state || {};
  const isResetFlow = resetState.flow === 'reset';
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(42);

  const code = useMemo(() => digits.join(''), [digits]);
  const destination = resetState.channel === 'phone'
    ? resetState.phone
    : resetState.email;

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const updateDigit = (index, value) => {
    const next = value.replace(/\D/g, '').slice(-1);
    setDigits((previous) => {
      const copy = [...previous];
      copy[index] = next;
      return copy;
    });
    if (next && index < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    if (code.length < CODE_LENGTH) {
      push('Enter the 6-digit code.', 'error');
      return;
    }

    if (isResetFlow) {
      navigate('/CreatePassword', {
        replace: true,
        state: {
          ...resetState,
          code,
        },
      });
      return;
    }

    push('Phone verification is not live yet. Use email sign in for now.', 'error');
    navigate('/EmailLogin');
  };

  const backTo = isResetFlow ? '/ForgotPassword' : '/PhoneLogin';

  return (
    <AuthPage
      backTo={backTo}
      align="start"
      header={(
        <>
          <h1 className="auth-heading auth-heading--brand">Enter the code</h1>
          <p className="auth-subheading">
            {isResetFlow
              ? `We sent a 6-digit code to your ${resetState.channel === 'phone' ? 'phone' : 'email'}${destination ? ` (${destination})` : ''}.`
              : 'We sent a 6-digit code to your phone.'}
          </p>
        </>
      )}
      footer={(
        <Button
          variant={code.length === CODE_LENGTH ? 'primary' : 'disabled'}
          disabled={code.length !== CODE_LENGTH}
          onClick={handleVerify}
        >
          Verify
        </Button>
      )}
    >
      <div className="otp-grid" aria-label="Verification code">
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`otp-digit-${index}`}
            className="otp-grid__digit"
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
            maxLength={1}
            value={digit}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digit && index > 0) {
                document.getElementById(`otp-digit-${index - 1}`)?.focus();
              }
            }}
          />
        ))}
      </div>

      <p className="otp-resend">
        {secondsLeft > 0 ? (
          <>
            Resend in <span>{secondsLeft}s</span>
          </>
        ) : (
          <button type="button" className="auth-link" onClick={() => setSecondsLeft(42)}>
            Resend code
          </button>
        )}
      </p>
    </AuthPage>
  );
}
