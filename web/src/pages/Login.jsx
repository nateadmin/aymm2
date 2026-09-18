import { Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/mobile/AuthPage';
import HeartLogo from '@/components/brand/HeartLogo';
import SocialAuthButton from '@/components/ui/SocialAuthButton';

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.91v-8.4H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79v8.4C19.61 23.08 24 18.09 24 12.07z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="50%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="#fff" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthPage
      backTo="/Welcome"
      header={(
        <>
          <HeartLogo />
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Sign in to continue</p>
        </>
      )}
      footer={(
        <p className="auth-footer">
          No account? <button type="button" onClick={() => navigate('/Register')}>Sign Up</button>
        </p>
      )}
    >
      <div className="auth-stack">
        <SocialAuthButton icon={<FacebookIcon />}>Continue with Facebook</SocialAuthButton>
        <SocialAuthButton icon={<InstagramIcon />}>Continue with Instagram</SocialAuthButton>
        <div className="auth-divider">or</div>
        <SocialAuthButton icon={<Mail size={18} />} onClick={() => navigate('/EmailLogin')}>
          Continue with Email
        </SocialAuthButton>
        <SocialAuthButton icon={<Phone size={18} />} onClick={() => navigate('/PhoneLogin')}>
          Continue with Phone
        </SocialAuthButton>
      </div>
    </AuthPage>
  );
}
