import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import {
  CHILD_SEEKING_FOR,
  PARENT_SEEKING_FOR,
  SIBLING_REASONS,
} from '@/lib/onboarding';
import { FAMILY_VIBES } from '@/lib/constants';

export default function QuestionsStep() {
  const navigate = useNavigate();
  const {
    form,
    updateField,
    toggleArrayValue,
    saveDraft,
    saving,
    isChild,
    isParent,
    isFamily,
  } = useProfileSetup();

  const handleContinue = async () => {
    const saved = await saveDraft('questions');
    if (saved) {
      navigate('/ProfileSetup/bio');
    }
  };

  return (
    <div className="page-shell__grid">
      {isChild ? (
        <>
          <p className="page-shell__eyebrow">Seeking parent for</p>
          <div className="onboarding-checklist">
            {CHILD_SEEKING_FOR.map((item) => (
              <label key={item} className="aymm-field">
                <input
                  type="checkbox"
                  className="aymm-check"
                  checked={form.seeking_for.includes(item)}
                  onChange={() => toggleArrayValue('seeking_for', item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <label className="aymm-field">
            <input
              type="checkbox"
              className="aymm-check"
              checked={form.real_life_visits}
              onChange={(e) => updateField('real_life_visits', e.target.checked)}
            />
            <span>Real-life visits</span>
          </label>
          <TextField label="Grow-up goal" name="grow_up_goal" value={form.grow_up_goal} onChange={(e) => updateField('grow_up_goal', e.target.value)} />
          <TextField label="Working towards" name="working_towards" value={form.working_towards} onChange={(e) => updateField('working_towards', e.target.value)} />
          <TextField label="Favorite foods" name="favorite_foods" value={form.favorite_foods} onChange={(e) => updateField('favorite_foods', e.target.value)} />
          <TextField label="Hobbies" name="hobbies" value={form.hobbies} onChange={(e) => updateField('hobbies', e.target.value)} />
          <TextField label="Last book" name="last_book" value={form.last_book} onChange={(e) => updateField('last_book', e.target.value)} />
          <TextField label="Last movie" name="last_movie" value={form.last_movie} onChange={(e) => updateField('last_movie', e.target.value)} />
          <label className="aymm-field">
            <span className="aymm-label">Favorite childhood memory</span>
            <textarea
              className="aymm-textarea"
              value={form.favorite_childhood_memory}
              onChange={(e) => updateField('favorite_childhood_memory', e.target.value)}
              rows={4}
            />
          </label>
        </>
      ) : null}

      {isParent ? (
        <>
          <p className="page-shell__eyebrow">Seeking child for</p>
          <div className="onboarding-checklist">
            {PARENT_SEEKING_FOR.map((item) => (
              <label key={item} className="aymm-field">
                <input
                  type="checkbox"
                  className="aymm-check"
                  checked={form.seeking_for.includes(item)}
                  onChange={() => toggleArrayValue('seeking_for', item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <label className="aymm-field">
            <input type="checkbox" className="aymm-check" checked={form.can_host_visitors} onChange={(e) => updateField('can_host_visitors', e.target.checked)} />
            <span>Can host visitors</span>
          </label>
          <label className="aymm-field">
            <input type="checkbox" className="aymm-check" checked={form.has_biological_kids} onChange={(e) => updateField('has_biological_kids', e.target.checked)} />
            <span>Has biological kids</span>
          </label>
          <label className="aymm-field">
            <input type="checkbox" className="aymm-check" checked={form.enjoy_feeding_youth} onChange={(e) => updateField('enjoy_feeding_youth', e.target.checked)} />
            <span>Enjoy feeding youth</span>
          </label>
          <TextField label="Favorite foods" name="favorite_foods" value={form.favorite_foods} onChange={(e) => updateField('favorite_foods', e.target.value)} />
          <TextField label="Hobbies" name="hobbies" value={form.hobbies} onChange={(e) => updateField('hobbies', e.target.value)} />
          <TextField label="Favorite books" name="favorite_books" value={form.favorite_books} onChange={(e) => updateField('favorite_books', e.target.value)} />
          <label className="aymm-field">
            <span className="aymm-label">Myths about my day</span>
            <textarea className="aymm-textarea" value={form.myths_about_my_day} onChange={(e) => updateField('myths_about_my_day', e.target.value)} rows={3} />
          </label>
          <label className="aymm-field">
            <span className="aymm-label">If you were my kid, I would tell you...</span>
            <textarea className="aymm-textarea" value={form.if_you_were_my_kid} onChange={(e) => updateField('if_you_were_my_kid', e.target.value)} rows={3} />
          </label>
        </>
      ) : null}

      {isFamily ? (
        <>
          <p className="page-shell__eyebrow">Seeking a sibling because</p>
          <div className="onboarding-checklist">
            {SIBLING_REASONS.map((item) => (
              <label key={item} className="aymm-field">
                <input
                  type="checkbox"
                  className="aymm-check"
                  checked={form.seeking_sibling_reasons.includes(item)}
                  onChange={() => toggleArrayValue('seeking_sibling_reasons', item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <TextField label="Family name" name="family_name" value={form.family_name} onChange={(e) => updateField('family_name', e.target.value)} />
          <TextField label="Sibling count" name="sibling_count" type="number" value={form.sibling_count} onChange={(e) => updateField('sibling_count', e.target.value)} />
          <TextField label="Beds available" name="beds_available" type="number" value={form.beds_available} onChange={(e) => updateField('beds_available', e.target.value)} />
          <TextField label="Favorite holidays" name="favorite_holidays" value={form.favorite_holidays} onChange={(e) => updateField('favorite_holidays', e.target.value)} />
          <label className="aymm-field">
            <span className="aymm-label">Family vibe</span>
            <select className="aymm-select" value={form.family_vibe} onChange={(e) => updateField('family_vibe', e.target.value)}>
              {FAMILY_VIBES.map((vibe) => (
                <option key={vibe} value={vibe}>{vibe === 'loud_house' ? 'Loud House' : 'Church Mice'}</option>
              ))}
            </select>
          </label>
        </>
      ) : null}

      <div className="public-page__actions">
        <Button disabled={saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
