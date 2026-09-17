import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';

export default function DiscoveryRadioScreen({
  title,
  subtitle,
  options,
  backTo,
  continueTo,
  initialValue = '',
}) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(initialValue);

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--between mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to={backTo} />
          <div>
            <h1 className="auth-heading auth-heading--brand">{title}</h1>
            <p className="auth-subheading">{subtitle}</p>
          </div>

          <div className="identity-role-list" role="radiogroup" aria-label={title}>
            {options.map((option) => {
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

        <Button
          variant={selected ? 'primary' : 'disabled'}
          disabled={!selected}
          onClick={() => navigate(continueTo)}
        >
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
