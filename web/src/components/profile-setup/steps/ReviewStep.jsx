import React from 'react';
import Button from '@/components/ui/Button';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { labelForIdentity, labelForReligion } from '@/lib/constants';

export default function ReviewStep() {
  const { form, completeOnboarding, saving, isFamily } = useProfileSetup();

  const summary = [
    { label: 'Name', value: form.display_name },
    { label: 'Age', value: form.age },
    { label: 'Location', value: form.location },
    { label: 'I am a', value: labelForIdentity(form.identity_type) },
    {
      label: 'Seeking',
      value: isFamily
        ? 'Hosting tables'
        : form.seeking_types.map(labelForIdentity).join(', '),
    },
    { label: 'Faith', value: labelForReligion(form.religion) },
    { label: 'Photos', value: `${form.profile_photos.length} uploaded` },
    { label: 'Video', value: form.intro_video_url ? '10-sec video ready' : 'Skipped' },
    { label: 'Bio', value: `${form.bio?.length || 0} characters` },
  ];

  return (
    <div className="page-shell__grid">
      <p className="aymm-muted">Review your profile before finishing onboarding.</p>
      <dl className="onboarding-review">
        {summary.map((item) => (
          <div key={item.label} className="onboarding-review__row">
            <dt>{item.label}</dt>
            <dd>{item.value || '—'}</dd>
          </div>
        ))}
      </dl>
      {form.profile_photos.length ? (
        <div className="photo-upload__grid">
          {form.profile_photos.map((url, index) => (
            <img key={`${url}-${index}`} src={url} alt="" className="photo-upload__image" />
          ))}
        </div>
      ) : null}
      <div className="public-page__actions">
        <Button disabled={saving} onClick={completeOnboarding}>
          {saving ? 'Saving...' : 'Complete profile'}
        </Button>
      </div>
    </div>
  );
}
