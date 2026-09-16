import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { geocodeZipcode } from '@/lib/geocoding';
import { useToast } from '@/lib/toast';

export default function BasicInfoStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();
  const { push } = useToast();
  const [located, setLocated] = useState(Boolean(form.lat && form.location));

  const handleZipLookup = async () => {
    try {
      const result = await geocodeZipcode(form.zipcode);
      updateField('location', result.location);
      updateField('lat', result.lat);
      updateField('lon', result.lon);
      updateField('zipcode', result.zipcode);
      setLocated(true);
      push('Located from zipcode.', 'success');
    } catch {
      setLocated(false);
      push('Could not locate that zipcode.', 'error');
    }
  };

  const valid = form.display_name && form.age && form.zipcode && form.location;

  const handleContinue = async () => {
    const saved = await saveDraft('basic-info');
    if (saved) {
      navigate('/ProfileSetup/iam-a');
    }
  };

  return (
    <div className="page-shell__grid">
      <TextField
        label="Display name"
        name="display_name"
        value={form.display_name}
        onChange={(e) => updateField('display_name', e.target.value)}
      />
      <TextField
        label="Age"
        name="age"
        type="number"
        value={form.age}
        onChange={(e) => updateField('age', e.target.value)}
      />
      <TextField
        label="Zipcode"
        name="zipcode"
        value={form.zipcode}
        onChange={(e) => updateField('zipcode', e.target.value)}
      />
      <Button variant="outline" onClick={handleZipLookup}>Locate zipcode</Button>
      {located ? <p className="aymm-muted">Located {form.location}</p> : null}
      <TextField
        label="City / Town"
        name="location"
        value={form.location}
        onChange={(e) => updateField('location', e.target.value)}
      />
      <div className="public-page__actions">
        <Button disabled={!valid || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
