import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import FamilyTableHostForm from '@/components/community/FamilyTableHostForm';
import { useCommunityTableListing } from '@/hooks/useCommunityTableListing';
import {
  formatDietaryCertification,
  isRegisterFormComplete,
  registerFormFromTable,
  tablePatchFromRegisterForm,
} from '@/lib/communityTableListing';
import { useAuth } from '@/lib/auth';
import { resolveAppRoute } from '@/lib/appRoutes';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function FamilyTableListing() {
  const navigate = useNavigate();
  const { user, profile, hasProfile } = useAuth();
  const { table, updateTable } = useCommunityTableListing();
  const [hostOpen, setHostOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  const openHostEditor = () => {
    setDraft(registerFormFromTable(table));
    setHostOpen(true);
  };

  const saveHostDetails = () => {
    if (!draft || !isRegisterFormComplete(draft)) return;
    updateTable(tablePatchFromRegisterForm(draft));
    setHostOpen(false);
    setDraft(null);
  };

  return (
    <CommunityScreen bodyClassName="community-table-detail-screen">
      <div className="community-table-detail">
        <div className="community-table-detail__toolbar">
          <BackButton to={withPreviewQuery(resolveAppRoute('home', { user, profile, hasProfile }))} />
        </div>

        <div className="community-table-detail__hero">
          <img src={table.photo} alt="" className="community-table-detail__hero-image" />
        </div>

        <div className="community-table-detail__body">
          <div className="hero-profile-identity">
            <h1 className="hero-profile-identity__name community-table-detail__title">{table.name}</h1>
            <p className="hero-profile-identity__meta community-table-detail__headline">{table.headline}</p>
          </div>

          <div className="community-table-detail__stats">
            <div className="community-table-detail__stat">
              <strong>{table.seatsLeft} left</strong>
              <span>Seats</span>
            </div>
            <div className="community-table-detail__stat">
              <strong>{table.bedsAvailable} avail.</strong>
              <span>Beds</span>
            </div>
            <div className="community-table-detail__stat">
              <strong>{table.faith}</strong>
              <span>Faith</span>
            </div>
          </div>

          <dl className="community-table-detail__facts">
            <div><dt>Family username</dt><dd>{table.hostUsername || '—'}</dd></div>
            <div><dt>Address</dt><dd>{table.address || '—'}</dd></div>
            <div><dt>Phone</dt><dd>{table.phone || '—'}</dd></div>
            <div><dt>Date</dt><dd>{table.eventDate || table.holiday}</dd></div>
            <div><dt>Seats available</dt><dd>{table.seatsLeft}</dd></div>
            <div><dt>Food</dt><dd>{table.food}</dd></div>
            <div><dt>Dietary</dt><dd>{formatDietaryCertification(table.dietaryCertification)}</dd></div>
            <div><dt>For guests</dt><dd>{table.guestExpectations || 'Host has not added expectations yet.'}</dd></div>
            <div><dt>About gathering</dt><dd>{table.about || '—'}</dd></div>
            <div><dt>Religion</dt><dd>{table.religion}</dd></div>
          </dl>

          <section className="community-table-detail__host-panel aymm-panel">
            <div className="community-table-detail__host-header">
              <h2 className="community-table-detail__host-title">Host your table</h2>
              <p className="aymm-muted">
                Same fields as Register Table — update your listing any time.
              </p>
            </div>
            {hostOpen && draft ? (
              <>
                <FamilyTableHostForm value={draft} onChange={setDraft} />
                <div className="community-table-detail__host-actions">
                  <Button
                    variant={isRegisterFormComplete(draft) ? 'primary' : 'disabled'}
                    disabled={!isRegisterFormComplete(draft)}
                    onClick={saveHostDetails}
                  >
                    Save listing
                  </Button>
                  <Button variant="outline" onClick={() => { setHostOpen(false); setDraft(null); }}>Cancel</Button>
                </div>
              </>
            ) : (
              <Button variant="outline" onClick={openHostEditor}>Edit listing</Button>
            )}
          </section>

          <button
            type="button"
            className="community-table-detail__link"
            onClick={() => navigate(withPreviewQuery('/Community/previous-photos'))}
          >
            See previous table photos →
          </button>

          <div className="community-table-detail__actions">
            <Button onClick={() => navigate(withPreviewQuery('/Community/request-join-table'))}>
              Request to Join
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(withPreviewQuery('/Community/family-table-details'))}
            >
              View Full Details
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(withPreviewQuery('/Community/register-table'))}
            >
              Open register form
            </Button>
          </div>
        </div>
      </div>
    </CommunityScreen>
  );
}