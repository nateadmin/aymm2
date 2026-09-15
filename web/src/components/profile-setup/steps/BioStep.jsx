import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { BIO_MIN_LENGTH } from '@/lib/constants';

export default function BioStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving, isFamily } = useProfileSetup();
  const remaining = BIO_MIN_LENGTH - (form.bio?.length || 0);
  const valid = (form.bio?.length || 0) >= BIO_MIN_LENGTH;

  const handleContinue = async () => {
    const saved = await saveDraft('bio');
    if (saved) {
      navigate('/ProfileSetup/review');
    }
  };

  return (
    <div className="page-shell__grid">
      <p className="aymm-muted">
        Tell everyone about {isFamily ? 'your family' : 'yourself'}. Minimum {BIO_MIN_LENGTH} characters.
      </p>
      <label className="aymm-field">
        <span className="aymm-label">Bio</span>
        <textarea
          className="aymm-textarea"
          value={form.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={8}
        />
      </label>
      <p className="aymm-muted">
        {valid ? 'Ready to continue' : `${remaining} characters remaining`}
      </p>
      <div className="public-page__actions">
        <Button disabled={!valid || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
