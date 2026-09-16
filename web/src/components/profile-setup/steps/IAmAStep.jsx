import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { IDENTITY_TYPES, labelForIdentity } from '@/lib/constants';

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
    <div className="page-shell__grid">
      <p className="aymm-muted">Choose the role that best describes you. This is locked after onboarding.</p>
      <div className="onboarding-options">
        {IDENTITY_TYPES.map((type) => (
          <label key={type} className={`onboarding-option${form.identity_type === type ? ' onboarding-option--selected' : ''}`}>
            <input
              type="radio"
              name="identity_type"
              value={type}
              checked={form.identity_type === type}
              onChange={() => updateField('identity_type', type)}
            />
            <span>{labelForIdentity(type)}</span>
          </label>
        ))}
      </div>
      <div className="public-page__actions">
        <Button disabled={!form.identity_type || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
