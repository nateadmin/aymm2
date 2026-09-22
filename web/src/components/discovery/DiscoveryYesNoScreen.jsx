import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';

function YesNoToggle({ value, onChange, label }) {
  return (
    <div className="discovery-yesno">
      <p className="discovery-yesno__label">{label}</p>
      <div className="discovery-yesno__toggle" role="group" aria-label={label}>
        <button
          type="button"
          className={`discovery-yesno__option${value === true ? ' discovery-yesno__option--selected' : ''}`}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`discovery-yesno__option${value === false ? ' discovery-yesno__option--selected' : ''}`}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function DiscoveryYesNoScreen({
  title,
  subtitle,
  questions,
  backTo,
  continueTo,
  initialValues = {},
}) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    const defaults = {};
    questions.forEach((question) => {
      defaults[question.field] = initialValues[question.field] ?? null;
    });
    return defaults;
  });

  const allAnswered = questions.every((question) => answers[question.field] !== null);

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={backTo} />
          <div>
            <h1 className="auth-heading auth-heading--brand">{title}</h1>
            <p className="auth-subheading">{subtitle}</p>
          </div>

          <div className="discovery-yesno-list">
            {questions.map((question) => (
              <YesNoToggle
                key={question.field}
                label={question.label}
                value={answers[question.field]}
                onChange={(next) => setAnswers((current) => ({ ...current, [question.field]: next }))}
              />
            ))}
          </div>
        </div>

        <Button
          variant={allAnswered ? 'primary' : 'disabled'}
          disabled={!allAnswered}
          onClick={() => navigate(continueTo)}
        >
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
