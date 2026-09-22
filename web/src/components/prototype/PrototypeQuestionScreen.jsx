import { Check } from 'lucide-react';
import { useState } from 'react';
import PrototypeScreen from './PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';

export default function PrototypeQuestionScreen({
  title,
  subtitle,
  groups,
  backTo,
  onContinue,
}) {
  const [answers, setAnswers] = useState(
    () => groups.reduce((acc, group, index) => {
      acc[index] = group.initial || '';
      return acc;
    }, {}),
  );

  const updateAnswer = (groupIndex, value) => {
    setAnswers((current) => ({ ...current, [groupIndex]: value }));
  };

  const complete = groups.every((_, index) => answers[index]);

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={backTo} />

          <div>
            <h1 className="auth-heading auth-heading--brand">{title}</h1>
            <p className="auth-subheading">{subtitle}</p>
          </div>

          <div className="prototype-question-groups">
            {groups.map((group, groupIndex) => (
              <section key={group.label} className="prototype-question-group">
                <h2 className="prototype-question-group__label">{group.label}</h2>
                <div className="identity-role-list" role="radiogroup" aria-label={group.label}>
                  {group.options.map((option) => {
                    const isSelected = answers[groupIndex] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`identity-role-option identity-role-option--text${isSelected ? ' identity-role-option--selected' : ''}`}
                        onClick={() => updateAnswer(groupIndex, option)}
                      >
                        <span className="identity-role-option__label">{option}</span>
                        <span className="identity-role-option__radio" aria-hidden="true">
                          {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <Button
          variant={complete ? 'primary' : 'disabled'}
          disabled={!complete}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </PrototypeScreen>
  );
}
