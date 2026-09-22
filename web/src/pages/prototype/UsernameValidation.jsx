import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function UsernameValidation() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('emilygomes');
  const [checked, setChecked] = useState(true);

  const handleCheck = () => {
    setChecked(Boolean(username.trim()));
  };

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--auth auth-page auth-page--start prototype-username">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Prototype/register-table-full')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Choose a username</h1>
            <p className="auth-subheading">This is how families find your table.</p>
          </div>

          <label className="auth-field">
            <span className="auth-field__label">AYMM Family Username</span>
            <div className="input-action-row">
              <input
                className="aymm-input"
                placeholder="@yourfamilyname"
                value={username ? `@${username.replace(/^@/, '')}` : ''}
                onChange={(event) => {
                  setChecked(false);
                  setUsername(event.target.value.replace(/^@/, ''));
                }}
              />
              <Button variant="purple" className="aymm-button--inline" onClick={handleCheck}>
                Check
              </Button>
            </div>
          </label>

          {checked && username ? (
            <p className="prototype-username__success">
              ✅ @{username.replace(/^@/, '')} is available!
            </p>
          ) : null}
        </div>

        <div className="auth-page__footer">
          <Button
            variant={checked ? 'primary' : 'disabled'}
            disabled={!checked}
            onClick={() => navigate(withPreviewQuery('/Community/table-confirmation'))}
          >
            Continue
          </Button>
        </div>
      </div>
    </PrototypeScreen>
  );
}
