import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import Button from '@/components/ui/Button';

export default function CompleteStep() {
  const navigate = useNavigate();

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--between mobile-onboarding complete-step">
        <div className="complete-step__content">
          <div className="complete-step__hero">
            <HeartLogo style={{ width: '3rem', height: '3rem' }} />
            <h1 className="auth-heading auth-heading--brand">You&apos;re all set!</h1>
            <p className="auth-subheading">
              Your profile is under review. We&apos;ll notify you as soon as it&apos;s approved —
              usually within 24 hours.
            </p>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>Profile submitted</span>
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>Under review...</span>
            </li>
            <li className="complete-step__status complete-step__status--pending">
              <span className="complete-step__status-icon" aria-hidden="true" />
              <span>Start finding family</span>
            </li>
          </ul>
        </div>

        <Button onClick={() => navigate('/Home', { replace: true })}>
          Start Finding Family
        </Button>
      </div>
    </MobileScreen>
  );
}
