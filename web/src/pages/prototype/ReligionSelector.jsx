import { Check, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { RELIGION_OPTIONS } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function ReligionSelector() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('Christianity');

  const options = useMemo(
    () => RELIGION_OPTIONS.filter((option) => option.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <PrototypeScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Prototype/profile-carousel')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Select Religion</h1>
            <p className="auth-subheading">Choose one that best represents you</p>
          </div>

          <label className="prototype-religion-search">
            <Search size={16} />
            <input
              className="aymm-input prototype-religion-search__input"
              placeholder="Search religions..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="identity-role-list" role="radiogroup" aria-label="Religion">
            {options.map((option) => {
              const isSelected = selected === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`identity-role-option identity-role-option--text${isSelected ? ' identity-role-option--selected' : ''}`}
                  onClick={() => setSelected(option)}
                >
                  <span className="identity-role-option__label">{option}</span>
                  <span className="identity-role-option__radio" aria-hidden="true">
                    {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={() => navigate(withPreviewQuery('/Prototype/profile-carousel'))}>
          Continue
        </Button>
      </div>
    </PrototypeScreen>
  );
}
