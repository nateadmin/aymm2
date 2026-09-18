import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { ONBOARDING_PROFILE_QUESTIONS } from '@/lib/onboardingQuestions';

export default function QuestionsStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();

  const valid = ONBOARDING_PROFILE_QUESTIONS.every((question) => form[question.field]);

  const handleContinue = async () => {
    const saved = await saveDraft('questions');
    if (saved) {
      navigate('/ProfileSetup/review');
    }
  };

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/religion" />
          <MobileOnboardingProgress step={7} />

          <div>
            <h1 className="auth-heading auth-heading--brand">A few questions</h1>
            <p className="auth-subheading">Help families understand what makes you, you.</p>
          </div>

          {ONBOARDING_PROFILE_QUESTIONS.map((question) => (
            <section key={question.field} className="onboarding-question">
              <h2 className="onboarding-question__title">{question.title}</h2>
              <div className="identity-role-list" role="radiogroup" aria-label={question.title}>
                {question.options.map((option) => {
                  const selected = form[question.field] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`identity-role-option identity-role-option--text${selected ? ' identity-role-option--selected' : ''}`}
                      onClick={() => updateField(question.field, option.id)}
                    >
                      <span className="identity-role-option__label">{option.label}</span>
                      <span className="identity-role-option__radio" aria-hidden="true">
                        {selected ? <Check size={14} strokeWidth={3} /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
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
