import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { RELIGION_INFO_OPTIONS } from '@/lib/discoveryContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function ReligionInfo() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('christianity');

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Discovery/family-questions')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Faith &amp; Religion</h1>
            <p className="auth-subheading">
              Sharing your faith helps families find the right match. This is optional.
            </p>
          </div>

          <div>
            <p className="discovery-section-label">Your religion or belief system</p>
            <div className="identity-role-list" role="radiogroup" aria-label="Faith and religion">
              {RELIGION_INFO_OPTIONS.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`identity-role-option identity-role-option--text${isSelected ? ' identity-role-option--selected' : ''}`}
                    onClick={() => setSelected(option.id)}
                  >
                    <span className="identity-role-option__label">{option.label}</span>
                    <span className="identity-role-option__radio" aria-hidden="true">
                      {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Button onClick={() => navigate(withPreviewQuery('/Discovery/recommend'))}>
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
