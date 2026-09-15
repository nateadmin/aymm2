import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { RELIGIONS } from '@/lib/constants';

const RELIGION_LABELS = {
  christianity: 'Christianity',
  islam: 'Islam',
  judaism: 'Judaism',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  sikhism: 'Sikhism',
  bahai: "Bahá'í",
  jainism: 'Jainism',
  shinto: 'Shinto',
  taoism: 'Taoism',
  zoroastrianism: 'Zoroastrianism',
  atheist: 'Atheist',
  agnostic: 'Agnostic',
  spiritual: 'Spiritual',
  other: 'Other',
  open_to_all: 'Open to all',
};

export default function ReligionStep() {
  const navigate = useNavigate();
  const { form, updateField, saveDraft, saving } = useProfileSetup();

  const handleContinue = async () => {
    const saved = await saveDraft('religion');
    if (saved) {
      navigate('/ProfileSetup/questions');
    }
  };

  return (
    <div className="page-shell__grid">
      <p className="aymm-muted">Open to all means you are open to connecting with people of any faith.</p>
      <label className="aymm-field">
        <span className="aymm-label">Religion</span>
        <select
          className="aymm-select"
          value={form.religion}
          onChange={(e) => updateField('religion', e.target.value)}
        >
          <option value="">Select religion</option>
          {RELIGIONS.map((religion) => (
            <option key={religion} value={religion}>
              {RELIGION_LABELS[religion] || religion}
            </option>
          ))}
        </select>
      </label>
      <label className="aymm-field">
        <input
          type="checkbox"
          className="aymm-check"
          checked={form.religion_private}
          onChange={(e) => updateField('religion_private', e.target.checked)}
        />
        <span>Keep my religion private</span>
      </label>
      <div className="public-page__actions">
        <Button disabled={!form.religion || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
