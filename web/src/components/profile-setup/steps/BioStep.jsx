import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { BIO_MIN_LENGTH } from '@/lib/constants';

export default function BioStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving, isFamily } = useProfileSetup();
  const length = form.bio?.length || 0;
  const remaining = BIO_MIN_LENGTH - length;
  const valid = length >= BIO_MIN_LENGTH;

  const handleContinue = async () => {
    const saved = await saveDraft('bio');
    if (saved) {
      navigate('/ProfileSetup/review');
    }
  };

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/questions" />
          <MobileOnboardingProgress step={8} />

          <div>
            <h1 className="auth-heading auth-heading--brand">About Me</h1>
            <p className="auth-subheading">
              Share your story so families can get to know {isFamily ? 'your family' : 'you'}.
            </p>
          </div>

          <label className="auth-field onboarding-bio-field">
            <span className="auth-field__label">Your story</span>
            <textarea
              className="aymm-textarea onboarding-bio-field__textarea"
              name="bio"
              rows={8}
              placeholder="Tell us about yourself — what you are hoping for, what matters to you, and what makes you, you."
              value={form.bio}
              onChange={(event) => updateField('bio', event.target.value)}
            />
          </label>
          <p className="auth-subheading onboarding-bio-field__hint">
            {valid ? 'Ready to continue' : `${Math.max(remaining, 0)} characters remaining (minimum ${BIO_MIN_LENGTH})`}
          </p>
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