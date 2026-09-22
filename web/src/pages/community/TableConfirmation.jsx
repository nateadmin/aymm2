import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import Button from '@/components/ui/Button';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function TableConfirmation() {
  const navigate = useNavigate();

  return (
    <CommunityScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding connection-success">
        <div className="connection-success__content">
          <div className="connection-success__hero">
            <div className="connection-success__pulse community-confirm__icon" aria-hidden="true">
              <Check size={28} strokeWidth={3} />
            </div>
            <h1 className="auth-heading auth-heading--brand">Table Registered!</h1>
            <p className="auth-subheading connection-success__lede">
              Your Family Table is now live. Families in your area can request to join.
              We&apos;ll notify you when someone sends a request.
            </p>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Table published</span>
              <Check className="complete-step__status-trailing" size={16} strokeWidth={3} aria-hidden="true" />
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Accepting requests</span>
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Notifications active</span>
            </li>
          </ul>
        </div>

        <Button onClick={() => navigate(withPreviewQuery('/Community/family-table-listing'))}>
          Back to Family Tables
        </Button>
      </div>
    </CommunityScreen>
  );
}
