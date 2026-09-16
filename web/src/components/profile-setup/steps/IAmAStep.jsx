import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { IDENTITY_ROLE_OPTIONS } from '@/lib/constants';

export default function IAmAStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();

  const handleContinue = async () => {
    const saved = await saveDraft('iam-a');
    if (saved) {
      navigate('/ProfileSetup/seeking-a');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--between mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/basic-info" />
          <MobileOnboardingProgress step={4} />

          <div>
            <h1 className="auth-heading auth-heading--brand">I am a...</h1>
            <p className="auth-subheading">How do you identify in a family role?</p>
          </div>

          <div className="identity-role-list" role="radiogroup" aria-label="Family role">
            {IDENTITY_ROLE_OPTIONS.map((option) => {
              const selected = form.identity_type === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`identity-role-option${selected ? ' identity-role-option--selected' : ''}`}
                  onClick={() => updateField('identity_type', option.id)}
                >
                  <span className="identity-role-option__icon" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="identity-role-option__label">{option.label}</span>
                  <span className="identity-role-option__radio" aria-hidden="true">
                    {selected ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant={form.identity_type ? 'primary' : 'disabled'}
          disabled={!form.identity_type || saving}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
