import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { IDENTITY_ROLE_OPTIONS } from '@/lib/constants';

export default function SeekingAStep() {
  const navigate = useNavigate();
  const { form, toggleArrayValue, saveDraft, saving } = useProfileSetup();

  const valid = form.seeking_types.length > 0;

  const handleContinue = async () => {
    const saved = await saveDraft('seeking-a');
    if (saved) {
      navigate('/ProfileSetup/religion');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/iam-a" />
          <MobileOnboardingProgress step={5} />

          <div>
            <h1 className="auth-heading auth-heading--brand">I&apos;m looking for a...</h1>
            <p className="auth-subheading">Select all that apply</p>
          </div>

          <div className="identity-role-list" role="group" aria-label="Seeking roles">
            {IDENTITY_ROLE_OPTIONS.map((option) => {
              const selected = form.seeking_types.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  className={`identity-role-option${selected ? ' identity-role-option--selected' : ''}`}
                  onClick={() => toggleArrayValue('seeking_types', option.id)}
                >
                  <span className="identity-role-option__icon" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="identity-role-option__label">{option.label}</span>
                  <span
                    className={`identity-role-option__checkbox${selected ? ' identity-role-option__checkbox--selected' : ''}`}
                    aria-hidden="true"
                  >
                    {selected ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant={valid ? 'primary' : 'disabled'}
          disabled={!valid || saving}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
