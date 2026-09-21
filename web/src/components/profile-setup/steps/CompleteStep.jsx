import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import Button from '@/components/ui/Button';

export default function CompleteStep() {
  const navigate = useNavigate();

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding complete-step">
        <div className="complete-step__content">
          <div className="complete-step__hero">
            <HeartLogo className="complete-step__logo" alt="" />
            <h1 className="auth-heading auth-heading--brand complete-step__title">
              You&apos;re all set!
            </h1>
            <p className="auth-subheading complete-step__lede">
              Your profile is under review. We&apos;ll notify you as soon as it&apos;s approved —
              usually within 24 hours.
            </p>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Profile submitted</span>
              <Check className="complete-step__status-trailing" size={16} strokeWidth={3} aria-hidden="true" />
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Under review...</span>
            </li>
            <li className="complete-step__status complete-step__status--pending">
              <span className="complete-step__status-icon" aria-hidden="true" />
              <span className="complete-step__status-label">Start finding family</span>
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
