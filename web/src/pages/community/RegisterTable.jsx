import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import HostFamilyTableFields from '@/components/community/HostFamilyTableFields';
import { emitCommunityTableListingUpdated, saveCommunityTableListing } from '@/lib/communityTableListing';
import { withPreviewQuery } from '@/lib/screenCatalog';

const HOST_LISTING_DEFAULT = {
  seatsLeft: '',
  eventDateISO: '',
  eventDate: '',
  food: '',
  foodFull: '',
  dietaryCertification: 'neither',
  guestExpectations: '',
};

export default function RegisterTable() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    address: '',
    phone: '',
    details: '',
    ...HOST_LISTING_DEFAULT,
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const hostFieldsValid =
    form.seatsLeft !== ''
    && form.eventDateISO
    && form.food.trim()
    && form.guestExpectations.trim();

  const valid =
    form.username.trim()
    && form.address.trim()
    && form.phone.trim()
    && form.details.trim()
    && hostFieldsValid;

  const registerTable = () => {
    const seatsLeft = Number(form.seatsLeft);
    const patch = {
      name: form.username.trim() ? `${form.username.trim()} Table` : undefined,
      seatsLeft: Number.isFinite(seatsLeft) ? seatsLeft : form.seatsLeft,
      eventDateISO: form.eventDateISO,
      eventDate: form.eventDate,
      food: form.food,
      foodFull: form.food,
      dietaryCertification: form.dietaryCertification,
      guestExpectations: form.guestExpectations,
      guestCapacity: Number.isFinite(seatsLeft)
        ? `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} available`
        : undefined,
      about: form.details.trim(),
    };
    saveCommunityTableListing(patch);
    emitCommunityTableListingUpdated();
    navigate(withPreviewQuery('/Community/table-confirmation'));
  };

  return (
    <CommunityScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Community/family-table-listing')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Register Your Table</h1>
            <p className="auth-subheading">Open your home and let families find you.</p>
          </div>

          <div className="discovery-form-list">
            <label className="auth-field">
              <span className="auth-field__label">AYMM Family Username</span>
              <input
                className="aymm-input"
                placeholder="@yourfamilyname"
                value={form.username}
                onChange={(event) => update('username', event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Address</span>
              <input
                className="aymm-input"
                placeholder="123 Main St, City, State ZIP"
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Phone Number</span>
              <input
                className="aymm-input"
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
              />
            </label>
          </div>

          <div className="community-register-table__listing">
            <h2 className="auth-field__label">Listing details</h2>
            <HostFamilyTableFields
              value={form}
              onChange={(next) => setForm((current) => ({ ...current, ...next }))}
            />
          </div>

          <label className="auth-field">
            <span className="auth-field__label">About your gathering</span>
            <textarea
              className="aymm-textarea discovery-form-list__textarea"
              rows={4}
              placeholder="Atmosphere, who you hope to welcome, house rules..."
              value={form.details}
              onChange={(event) => update('details', event.target.value)}
            />
          </label>
        </div>

        <Button
          variant={valid ? 'primary' : 'disabled'}
          disabled={!valid}
          onClick={registerTable}
        >
          Register Table
        </Button>
      </div>
    </CommunityScreen>
  );
}