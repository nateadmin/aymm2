import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { RELIGION_ONBOARDING_OPTIONS } from '@/lib/constants';

export default function ReligionStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();

  const handleContinue = async () => {
    const saved = await saveDraft('religion');
    if (saved) {
      navigate('/ProfileSetup/questions');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--between mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/seeking-a" />
          <MobileOnboardingProgress step={6} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Faith &amp; Spirituality</h1>
            <p className="auth-subheading">Optional — helps us find compatible families</p>
          </div>

          <div className="identity-role-list" role="radiogroup" aria-label="Faith and spirituality">
            {RELIGION_ONBOARDING_OPTIONS.map((option) => {
              const selected = form.religion === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`identity-role-option identity-role-option--text${selected ? ' identity-role-option--selected' : ''}`}
                  onClick={() => updateField('religion', option.id)}
                >
                  <span className="identity-role-option__label">{option.label}</span>
                  <span className="identity-role-option__radio" aria-hidden="true">
                    {selected ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button disabled={saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
