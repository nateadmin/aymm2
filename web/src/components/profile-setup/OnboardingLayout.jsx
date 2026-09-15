import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLockup from '@/components/brand/BrandLockup';
import Button from '@/components/ui/Button';
import { ONBOARDING_STEPS, getStepIndex } from '@/lib/onboarding';
import { useProfileSetup } from './ProfileSetupContext';

function stepFromPath(pathname) {
  const match = ONBOARDING_STEPS.find((step) => pathname.startsWith(step.path));
  return match?.id || ONBOARDING_STEPS[0].id;
}

export default function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, steps } = useProfileSetup();
  const currentStepId = stepFromPath(location.pathname);
  const currentIndex = getStepIndex(currentStepId);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (currentIndex < 0) {
    return <Navigate to={ONBOARDING_STEPS[0].path} replace />;
  }

  return (
    <main className="public-page onboarding-page">
      <BrandLockup showSubtitle={false} />
      <section className="page-shell onboarding-shell">
        <header className="page-shell__header">
          <p className="page-shell__eyebrow">Onboarding</p>
          <h1 className="page-shell__title">{steps[currentIndex]?.label}</h1>
          <p className="page-shell__description">
            Step {currentIndex + 1} of {steps.length}
          </p>
        </header>

        <div className="onboarding-progress" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`onboarding-progress__dot${index <= currentIndex ? ' onboarding-progress__dot--active' : ''}`}
            />
          ))}
        </div>

        <Outlet />

        {currentIndex > 0 ? (
          <div className="onboarding-back">
            <Button
              variant="ghost"
              onClick={() => navigate(steps[currentIndex - 1].path)}
            >
              Back
            </Button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
