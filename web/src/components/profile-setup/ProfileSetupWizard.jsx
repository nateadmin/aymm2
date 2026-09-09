import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import {
  BIO_MIN_LENGTH,
  CHILD_IDENTITIES,
  FAMILY_VIBES,
  IDENTITY_TYPES,
  PARENT_IDENTITIES,
  PROFILE_SETUP_STEPS,
  RELIGIONS,
  SEEKING_PARENT_FOR,
  PARENT_PURPOSES,
  SIBLING_REASONS,
} from '@/lib/constants';
import { geocodeZipcode } from '@/lib/geocoding';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const STEP_LABELS = ['Basics', 'Role questions', 'Bio'];

export default function ProfileSetupWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refresh } = useAuth();
  const { push } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [located, setLocated] = useState(false);
  const [form, setForm] = useState({
    display_name: '',
    age: '',
    zipcode: '',
    location: '',
    lat: null,
    lon: null,
    identity_type: 'daughter',
    seeking_types: [],
    religion: 'open_to_all',
    religion_private: false,
    profile_photos: [],
    real_life_visits: false,
    seeking_for: [],
    grow_up_goal: '',
    working_towards: '',
    favorite_foods: '',
    hobbies: '',
    last_book: '',
    last_movie: '',
    favorite_childhood_memory: '',
    has_biological_kids: false,
    enjoy_feeding_youth: false,
    can_host_visitors: false,
    favorite_books: '',
    myths_about_my_day: '',
    if_you_were_my_kid: '',
    family_name: '',
    sibling_count: '',
    beds_available: '',
    favorite_holidays: '',
    family_vibe: 'loud_house',
    seeking_sibling_reasons: [],
    bio: '',
  });

  const step = PROFILE_SETUP_STEPS[stepIndex];
  const isChild = CHILD_IDENTITIES.includes(form.identity_type);
  const isParent = PARENT_IDENTITIES.includes(form.identity_type);
  const isFamily = form.identity_type === 'family';
  const bioRemaining = BIO_MIN_LENGTH - (form.bio?.length || 0);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        user_email: user.email,
        display_name: form.display_name,
        age: form.age ? Number(form.age) : null,
        zipcode: form.zipcode,
        location: form.location,
        lat: form.lat,
        lon: form.lon,
        identity_type: form.identity_type,
        seeking_type: form.seeking_types[0] || null,
        seeking_types: form.seeking_types,
        religion: form.religion,
        religion_private: form.religion_private,
        profile_photos: form.profile_photos,
        real_life_visits: form.real_life_visits,
        seeking_for: form.seeking_for,
        grow_up_goal: form.grow_up_goal,
        working_towards: form.working_towards,
        favorite_foods: form.favorite_foods,
        hobbies: form.hobbies,
        last_book: form.last_book,
        last_movie: form.last_movie,
        favorite_childhood_memory: form.favorite_childhood_memory,
        has_biological_kids: form.has_biological_kids,
        enjoy_feeding_youth: form.enjoy_feeding_youth,
        can_host_visitors: form.can_host_visitors,
        favorite_books: form.favorite_books,
        myths_about_my_day: form.myths_about_my_day,
        if_you_were_my_kid: form.if_you_were_my_kid,
        family_name: form.family_name,
        sibling_count: form.sibling_count ? Number(form.sibling_count) : null,
        beds_available: form.beds_available ? Number(form.beds_available) : null,
        favorite_holidays: form.favorite_holidays,
        family_vibe: form.family_vibe,
        seeking_sibling_reasons: form.seeking_sibling_reasons,
        bio: form.bio,
        setup_complete: true,
      };
      return entities.Profile.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Profile'] });
      await refresh();
      push('Profile saved.', 'success');
      navigate('/Home');
    },
    onError: () => push('Could not save profile yet.', 'error'),
  });

  const basicsValid = form.display_name && form.identity_type && form.seeking_types.length > 0;
  const bioValid = (form.bio?.length || 0) >= BIO_MIN_LENGTH;

  const canContinue = useMemo(() => {
    if (step === 'basics') return basicsValid;
    if (step === 'role') return true;
    return bioValid;
  }, [step, basicsValid, bioValid]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleArrayValue = (key, value) => {
    setForm((current) => {
      const list = current[key] || [];
      return {
        ...current,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const handleZipLookup = async () => {
    try {
      const result = await geocodeZipcode(form.zipcode);
      setForm((current) => ({ ...current, ...result }));
      setLocated(true);
      push('Located from zipcode.', 'success');
    } catch {
      setLocated(false);
      push('Could not locate that zipcode.', 'error');
    }
  };

  return (
    <div className="profile-setup-wizard">
      <div className="tab-bar">
        {STEP_LABELS.map((label, index) => (
          <span
            key={label}
            className={`tab-bar__tab${index === stepIndex ? ' tab-bar__tab--active' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>

      {step === 'basics' ? (
        <div className="page-shell__grid">
          <PlaceholderPanel title="Photo upload" description="Multi-photo upload via file storage (wired later)." />
          <TextField label="Display name" name="display_name" value={form.display_name} onChange={(e) => updateField('display_name', e.target.value)} />
          <TextField label="Age" name="age" type="number" value={form.age} onChange={(e) => updateField('age', e.target.value)} />
          <TextField label="Zipcode" name="zipcode" value={form.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
          <Button variant="outline" onClick={handleZipLookup}>Locate zipcode</Button>
          {located ? <p className="aymm-muted">✓ Located {form.location}</p> : null}
          <label className="aymm-field">
            <span className="aymm-label">Identity type (locked after save)</span>
            <select className="aymm-select" value={form.identity_type} onChange={(e) => updateField('identity_type', e.target.value)}>
              {IDENTITY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <PlaceholderPanel title="Seeking types" description="Multi-select checkboxes">
            <div className="page-shell__grid">
              {IDENTITY_TYPES.map((type) => (
                <label key={type} className="aymm-field">
                  <input
                    type="checkbox"
                    className="aymm-check"
                    checked={form.seeking_types.includes(type)}
                    onChange={() => toggleArrayValue('seeking_types', type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </PlaceholderPanel>
          <label className="aymm-field">
            <span className="aymm-label">Religion</span>
            <select className="aymm-select" value={form.religion} onChange={(e) => updateField('religion', e.target.value)}>
              {RELIGIONS.map((religion) => <option key={religion} value={religion}>{religion}</option>)}
            </select>
          </label>
        </div>
      ) : null}

      {step === 'role' ? (
        <div className="page-shell__grid">
          {isChild ? (
            <>
              <PlaceholderPanel title="Seeking parent for" description="Birthdays, holidays, consolation, etc.">
                {SEEKING_PARENT_FOR.map((item) => (
                  <label key={item} className="aymm-field">
                    <input type="checkbox" className="aymm-check" checked={form.seeking_for.includes(item)} onChange={() => toggleArrayValue('seeking_for', item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </PlaceholderPanel>
              <label className="aymm-field">
                <input type="checkbox" className="aymm-check" checked={form.real_life_visits} onChange={(e) => updateField('real_life_visits', e.target.checked)} />
                <span>Real-life visits</span>
              </label>
              <TextField label="Grow-up goal" name="grow_up_goal" value={form.grow_up_goal} onChange={(e) => updateField('grow_up_goal', e.target.value)} />
              <TextField label="Hobbies" name="hobbies" value={form.hobbies} onChange={(e) => updateField('hobbies', e.target.value)} />
              <TextField label="Last book" name="last_book" value={form.last_book} onChange={(e) => updateField('last_book', e.target.value)} />
              <TextField label="Last movie" name="last_movie" value={form.last_movie} onChange={(e) => updateField('last_movie', e.target.value)} />
              <TextField label="Favorite childhood memory" name="favorite_childhood_memory" value={form.favorite_childhood_memory} onChange={(e) => updateField('favorite_childhood_memory', e.target.value)} />
            </>
          ) : null}
          {isParent ? (
            <>
              <PlaceholderPanel title="Parent purposes">
                {PARENT_PURPOSES.map((item) => (
                  <label key={item} className="aymm-field">
                    <input type="checkbox" className="aymm-check" checked={form.seeking_for.includes(item)} onChange={() => toggleArrayValue('seeking_for', item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </PlaceholderPanel>
              <label className="aymm-field"><input type="checkbox" className="aymm-check" checked={form.can_host_visitors} onChange={(e) => updateField('can_host_visitors', e.target.checked)} /><span>Can host visitors</span></label>
              <label className="aymm-field"><input type="checkbox" className="aymm-check" checked={form.has_biological_kids} onChange={(e) => updateField('has_biological_kids', e.target.checked)} /><span>Has biological kids</span></label>
              <label className="aymm-field"><input type="checkbox" className="aymm-check" checked={form.enjoy_feeding_youth} onChange={(e) => updateField('enjoy_feeding_youth', e.target.checked)} /><span>Enjoy feeding youth</span></label>
              <TextField label="If you were my kid" name="if_you_were_my_kid" value={form.if_you_were_my_kid} onChange={(e) => updateField('if_you_were_my_kid', e.target.value)} />
              <TextField label="Myths about my day" name="myths_about_my_day" value={form.myths_about_my_day} onChange={(e) => updateField('myths_about_my_day', e.target.value)} />
            </>
          ) : null}
          {isFamily ? (
            <>
              <PlaceholderPanel title="Seeking sibling reasons">
                {SIBLING_REASONS.map((item) => (
                  <label key={item} className="aymm-field">
                    <input type="checkbox" className="aymm-check" checked={form.seeking_sibling_reasons.includes(item)} onChange={() => toggleArrayValue('seeking_sibling_reasons', item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </PlaceholderPanel>
              <TextField label="Family name" name="family_name" value={form.family_name} onChange={(e) => updateField('family_name', e.target.value)} />
              <TextField label="Sibling count" name="sibling_count" type="number" value={form.sibling_count} onChange={(e) => updateField('sibling_count', e.target.value)} />
              <TextField label="Beds available" name="beds_available" type="number" value={form.beds_available} onChange={(e) => updateField('beds_available', e.target.value)} />
              <TextField label="Favorite holidays" name="favorite_holidays" value={form.favorite_holidays} onChange={(e) => updateField('favorite_holidays', e.target.value)} />
              <label className="aymm-field">
                <span className="aymm-label">Family vibe</span>
                <select className="aymm-select" value={form.family_vibe} onChange={(e) => updateField('family_vibe', e.target.value)}>
                  {FAMILY_VIBES.map((vibe) => <option key={vibe} value={vibe}>{vibe}</option>)}
                </select>
              </label>
            </>
          ) : null}
        </div>
      ) : null}

      {step === 'bio' ? (
        <div className="page-shell__grid">
          <label className="aymm-field">
            <span className="aymm-label">Bio (minimum {BIO_MIN_LENGTH} characters)</span>
            <textarea
              className="aymm-textarea"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={6}
            />
          </label>
          <p className="aymm-muted">{bioRemaining > 0 ? `${bioRemaining} characters remaining` : 'Ready to submit'}</p>
        </div>
      ) : null}

      <div className="public-page__actions">
        {stepIndex > 0 ? (
          <Button variant="outline" onClick={() => setStepIndex((current) => current - 1)}>Back</Button>
        ) : null}
        {stepIndex < PROFILE_SETUP_STEPS.length - 1 ? (
          <Button disabled={!canContinue} onClick={() => setStepIndex((current) => current + 1)}>Continue</Button>
        ) : (
          <Button disabled={!bioValid || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
            Save profile
          </Button>
        )}
      </div>
    </div>
  );
}
