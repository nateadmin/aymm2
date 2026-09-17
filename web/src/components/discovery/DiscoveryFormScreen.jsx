import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';

export default function DiscoveryFormScreen({
  title,
  subtitle,
  fields,
  backTo,
  continueTo,
  initialValues = {},
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => {
    const defaults = {};
    fields.forEach((field) => {
      defaults[field.field] = initialValues[field.field] || '';
    });
    return defaults;
  });

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--between mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={backTo} />
          <div>
            <h1 className="auth-heading auth-heading--brand">{title}</h1>
            <p className="auth-subheading">{subtitle}</p>
          </div>

          <div className="discovery-form-list">
            {fields.map((field) => (
              <label key={field.field} className="auth-field">
                <span className="auth-field__label">{field.label}</span>
                <textarea
                  className="aymm-textarea discovery-form-list__textarea"
                  rows={3}
                  placeholder={field.placeholder}
                  value={values[field.field]}
                  onChange={(event) => updateField(field.field, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <Button onClick={() => navigate(continueTo)}>
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
