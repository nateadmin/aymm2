import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import Button from '@/components/ui/Button';
import { FAMILY_MATCH } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function AymmFamilyMatch() {
  const navigate = useNavigate();
  const match = FAMILY_MATCH;

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding connection-success prototype-success">
        <div className="connection-success__content">
          <img src={match.photo} alt="" className="prototype-family-match__photo" />

          <div className="connection-success__hero">
            <h1 className="auth-heading auth-heading--brand">Family Match!</h1>
            <p className="prototype-family-match__family">{match.name}</p>
            <p className="auth-subheading connection-success__lede">{match.message}</p>
          </div>

          <ul className="complete-step__status-list">
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Family connection made ✓</span>
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Letters unlocked ✓</span>
            </li>
            <li className="complete-step__status complete-step__status--done">
              <span className="complete-step__status-icon" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="complete-step__status-label">Family Table access granted ✓</span>
            </li>
          </ul>
        </div>

        <div className="connection-success__actions">
          <Button onClick={() => navigate(withPreviewQuery('/Community/open-conversation'))}>
            Send a Message
          </Button>
          <Button variant="outline" onClick={() => navigate(withPreviewQuery('/Community/family-table-listing'))}>
            View Family Table
          </Button>
        </div>
      </div>
    </PrototypeScreen>
  );
}
