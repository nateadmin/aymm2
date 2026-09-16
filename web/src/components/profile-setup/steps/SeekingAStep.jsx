import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { SEEKING_OPTIONS_FOR } from '@/lib/onboarding';
import { labelForIdentity } from '@/lib/constants';

export default function SeekingAStep() {
  const navigate = useNavigate();
  const { form, toggleArrayValue, saveDraft, saving, isFamily } = useProfileSetup();

  const options = SEEKING_OPTIONS_FOR[form.identity_type] || [];
  const valid = isFamily || form.seeking_types.length > 0;

  const handleContinue = async () => {
    const saved = await saveDraft('seeking-a');
    if (saved) {
      navigate('/ProfileSetup/religion');
    }
  };

  if (isFamily) {
    return (
      <div className="page-shell__grid">
        <p className="onboarding-callout">Families host tables and connect with others seeking a sibling.</p>
        <div className="public-page__actions">
          <Button disabled={saving} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell__grid">
      <p className="aymm-muted">Select one or both. You can also connect with a family unit.</p>
      <div className="onboarding-options">
        {options.map((type) => (
          <label key={type} className={`onboarding-option${form.seeking_types.includes(type) ? ' onboarding-option--selected' : ''}`}>
            <input
              type="checkbox"
              checked={form.seeking_types.includes(type)}
              onChange={() => toggleArrayValue('seeking_types', type)}
            />
            <span>{labelForIdentity(type)} / Family</span>
          </label>
        ))}
      </div>
      <div className="public-page__actions">
        <Button disabled={!valid || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
