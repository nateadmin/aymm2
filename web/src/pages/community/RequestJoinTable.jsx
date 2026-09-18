import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { JOHNSON_TABLE } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function RequestJoinTable() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const table = JOHNSON_TABLE;

  return (
    <CommunityScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--between mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Community/family-table-details')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Request to Join</h1>
            <p className="auth-subheading">
              Send a request to join The Johnson Family Table for Thanksgiving 2025.
            </p>
          </div>

          <div className="community-join-card">
            <img src={table.photo} alt="" className="community-join-card__photo" />
            <div>
              <p className="community-join-card__name">{table.name}</p>
              <p className="community-join-card__meta">Nov 27, 2025 · Memphis, TN</p>
              <p className="community-join-card__seats">{table.seatsLeft} seats remaining</p>
            </div>
          </div>

          <label className="auth-field">
            <span className="auth-field__label">Say something about yourself (optional)</span>
            <textarea
              className="aymm-textarea"
              rows={5}
              placeholder="A few words about who you are and why you'd love to join..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <Button onClick={() => navigate(withPreviewQuery('/Community/table-confirmation'))}>
          Send Request
        </Button>
      </div>
    </CommunityScreen>
  );
}
