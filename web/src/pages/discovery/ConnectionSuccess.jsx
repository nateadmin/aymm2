import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import Button from '@/components/ui/Button';
import { DAUGHTER_PROFILE } from '@/lib/discoveryProfiles';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function ConnectionSuccess() {
  const navigate = useNavigate();
  const photo = DAUGHTER_PROFILE.profile_photos[0];

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding connection-success">
        <div className="connection-success__content">
          <div className="connection-success__hero">
            <div className="connection-success__pulse" aria-hidden="true">
              <HeartLogo className="connection-success__logo" alt="" />
            </div>
            <h1 className="auth-heading auth-heading--brand">Request sent!</h1>
            <p className="auth-subheading connection-success__lede">
              Your request has been sent to {DAUGHTER_PROFILE.display_name}. We&apos;ll let you
              know as soon as she responds.
            </p>
          </div>

          <div className="connection-success__visual" aria-hidden="true">
            <img src={photo} alt="" className="connection-success__avatar" />
            <span className="connection-success__dots">···</span>
            <span className="connection-success__heart-badge">
              <HeartLogo className="connection-success__heart-badge-icon" alt="" />
            </span>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Request delivered</span>
              <Check className="complete-step__status-trailing" size={16} strokeWidth={3} aria-hidden="true" />
            </li>
            <li className="complete-step__status complete-step__status--pending">
              <span className="complete-step__status-icon" aria-hidden="true" />
              <span className="complete-step__status-label">Awaiting response...</span>
            </li>
          </ul>
        </div>

        <div className="connection-success__actions">
          <Button onClick={() => navigate(withPreviewQuery('/Home'))}>
            Keep Browsing
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(withPreviewQuery('/Messages'))}
          >
            Go to My Connections
          </Button>
        </div>
      </div>
    </MobileScreen>
  );
}
