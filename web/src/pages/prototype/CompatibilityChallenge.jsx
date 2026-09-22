import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { COMPATIBILITY_CHALLENGE } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function CompatibilityChallenge() {
  const navigate = useNavigate();
  const challenge = COMPATIBILITY_CHALLENGE;
  const [selected, setSelected] = useState('alone');

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding prototype-challenge">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Prototype/profile-carousel')} />

          <div className="prototype-challenge__progress">
            <span>Step {challenge.step} of {challenge.total}</span>
            <span className="prototype-challenge__percent">{challenge.percent}%</span>
          </div>
          <div className="prototype-challenge__bar" aria-hidden="true">
            <span style={{ width: `${challenge.percent}%` }} />
          </div>

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

        <Button onClick={() => navigate(withPreviewQuery('/Prototype/profile-carousel'))}>
          Next Question
        </Button>
      </div>
    </PrototypeScreen>
  );
}
