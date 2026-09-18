import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function RegisterTableFull() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    address: '',
    phone: '',
    zip: '',
    eventTitle: '',
    eventDescription: '',
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const valid = Object.values(form).every((value) => value.trim());

  return (
    <PrototypeScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--between mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Community/family-table-listing')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Register Your Table</h1>
            <p className="auth-subheading">Open your home and let families find you.</p>
          </div>

          <div className="discovery-form-list">
            <label className="auth-field">
              <span className="auth-field__label">AYMM Family Username</span>
              <div className="prototype-register-table__username">
                <input
                  className="aymm-input"
                  placeholder="@yourfamilyname"
                  value={form.username}
                  onChange={(event) => update('username', event.target.value)}
                />
                <button
                  type="button"
                  className="prototype-register-table__check"
                  onClick={() => navigate(withPreviewQuery('/Prototype/username-validation'))}
                >
                  Check
                </button>
              </div>
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Address</span>
              <input
                className="aymm-input"
                placeholder="123 Main St, City, State"
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
              <span className="auth-field__label">ZIP Code</span>
              <input
                className="aymm-input"
                placeholder="12345"
                value={form.zip}
                onChange={(event) => update('zip', event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Event Title</span>
              <input
                className="aymm-input"
                placeholder="e.g. Thanksgiving with the Johnsons"
                value={form.eventTitle}
                onChange={(event) => update('eventTitle', event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Event Description</span>
              <textarea
                className="aymm-textarea discovery-form-list__textarea"
                rows={5}
                placeholder="Describe your gathering..."
                value={form.eventDescription}
                onChange={(event) => update('eventDescription', event.target.value)}
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
    </PrototypeScreen>
  );
}
