import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';

export default function BasicInfoStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();

  const valid = form.display_name.trim() && form.age.trim() && form.location.trim();

  const handleContinue = async () => {
    const saved = await saveDraft('basic-info');
    if (saved) {
      navigate('/ProfileSetup/iam-a');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/upload-video" />
          <MobileOnboardingProgress step={3} />

          <div>
            <h1 className="auth-heading auth-heading--brand">About you</h1>
            <p className="auth-subheading">Just the basics — nothing complicated</p>
          </div>

          <div className="auth-stack">
            <label className="auth-field">
              <span className="auth-field__label">Your Name</span>
              <input
                className="aymm-input"
                type="text"
                name="display_name"
                placeholder="What should we call you?"
                value={form.display_name}
                onChange={(event) => updateField('display_name', event.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="auth-field">
              <span className="auth-field__label">Your Age</span>
              <input
                className="aymm-input"
                type="number"
                name="age"
                placeholder="How old are you?"
                value={form.age}
                onChange={(event) => updateField('age', event.target.value)}
                inputMode="numeric"
                min="18"
              />
            </label>

            <label className="auth-field">
              <span className="auth-field__label">Location</span>
              <input
                className="aymm-input"
                type="text"
                name="location"
                placeholder="City, State"
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
                autoComplete="address-level2"
              />
            </label>
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
