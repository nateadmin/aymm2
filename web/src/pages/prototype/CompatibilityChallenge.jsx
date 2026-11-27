import { Check } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import MobileHandheldFooter from '@/components/mobile/MobileHandheldFooter';
import Button from '@/components/ui/Button';
import { COMPATIBILITY_CHALLENGE } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function CompatibilityChallenge() {
  const navigate = useNavigate();
  const location = useLocation();
  const challenge = COMPATIBILITY_CHALLENGE;
  const [selected, setSelected] = useState('alone');
  const returnTo = location.state?.returnTo;
  const backTarget = returnTo
    ? returnTo
  : withPreviewQuery('/Prototype/profile-carousel');

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding prototype-challenge">
        <div className="mobile-onboarding__content">
          <BackButton to={backTarget} />

          <div>
            <p className="prototype-challenge__eyebrow">{challenge.label}</p>
            <h1 className="auth-heading auth-heading--brand">{challenge.question}</h1>
          </div>

          <div className="identity-role-list" role="radiogroup" aria-label={challenge.question}>
            {challenge.options.map((option) => {
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

        <MobileHandheldFooter>
          <Button onClick={() => navigate(backTarget)}>
            Continue
          </Button>
        </MobileHandheldFooter>
      </div>
    </PrototypeScreen>
  );
}
