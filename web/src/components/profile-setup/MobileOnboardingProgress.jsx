export default function MobileOnboardingProgress({ step, total = 10 }) {
  const percent = Math.round((step / total) * 100);

  return (
    <div className="mobile-onboarding__progress">
      <div className="mobile-onboarding__progress-row">
        <span className="mobile-onboarding__progress-label">
          Step {step} of {total}
        </span>
        <span className="mobile-onboarding__progress-percent">{percent}%</span>
      </div>
      <div className="mobile-onboarding__progress-track" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`mobile-onboarding__progress-segment${index < step ? ' mobile-onboarding__progress-segment--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
