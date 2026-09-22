import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function RegisterTable() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    address: '',
    phone: '',
    details: '',
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const valid = form.username.trim() && form.address.trim() && form.phone.trim() && form.details.trim();

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
            <label className="auth-field">
              <span className="auth-field__label">Event Details</span>
              <textarea
                className="aymm-textarea discovery-form-list__textarea"
                rows={5}
                placeholder="Describe your event — holiday, dates, food, atmosphere, number of guests..."
                value={form.details}
                onChange={(event) => update('details', event.target.value)}
              />
            </label>
          </div>
        </div>

        <Button
          variant={valid ? 'primary' : 'disabled'}
          disabled={!valid}
          onClick={() => navigate(withPreviewQuery('/Community/table-confirmation'))}
        >
          Register Table
        </Button>
      </div>
    </CommunityScreen>
  );
}
