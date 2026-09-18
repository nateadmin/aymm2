import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import Button from '@/components/ui/Button';
import { ADOPTION_APPROVED } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function AdoptionApproved() {
  const navigate = useNavigate();
  const match = ADOPTION_APPROVED;

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--between mobile-onboarding connection-success prototype-success">
        <div className="connection-success__content">
          <div className="prototype-success__avatars" aria-hidden="true">
            <img src={match.userPhoto} alt="" className="prototype-success__avatar" />
            <span className="prototype-success__heart">
              <HeartLogo className="prototype-success__heart-logo" alt="" />
            </span>
            <img src={match.matchPhoto} alt="" className="prototype-success__avatar" />
          </div>

          <div className="connection-success__hero">
            <h1 className="auth-heading auth-heading--brand">Congratulations!</h1>
            <p className="auth-subheading connection-success__lede">{match.message}</p>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Connection established ✓</span>
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Letters unlocked ✓</span>
            </li>
            <li className="complete-step__status complete-step__status--pending">
              <span className="complete-step__status-icon" aria-hidden="true" />
              <span className="complete-step__status-label">Family bond started</span>
            </li>
          </ul>
        </div>

        <div className="connection-success__actions">
          <Button onClick={() => navigate(withPreviewQuery('/Community/open-conversation'))}>
            Send a Message
          </Button>
          <Button variant="outline" onClick={() => navigate(withPreviewQuery('/Prototype/profile-carousel'))}>
            Keep Browsing
          </Button>
          <Button variant="outline" onClick={() => navigate(withPreviewQuery('/Prototype/home'))}>
            Return Home
          </Button>
        </div>
      </div>
    </PrototypeScreen>
  );
}
