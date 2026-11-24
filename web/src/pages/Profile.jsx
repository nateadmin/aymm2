import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { REVIEW_PROFILE_ROUTE, withPreviewQuery } from '@/lib/screenCatalog';
import { shouldUseDesignReviewShell } from '@/lib/session';
import Button from '@/components/ui/Button';
import MyProfileView from '@/components/profile/MyProfileView';
import { useAuth } from '@/lib/auth';
import { useMyProfile } from '@/hooks/useMyProfile';
import { CHILD_IDENTITIES } from '@/lib/constants';
import { buildMyProfileAnswerRows, profileIdentityMeta } from '@/lib/profileDisplay';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile: authProfile, hasProfile } = useAuth();

  useEffect(() => {
    if (shouldUseDesignReviewShell({ user, profile: authProfile, hasProfile })) {
      navigate(withPreviewQuery(REVIEW_PROFILE_ROUTE, { native: false }), { replace: true });
    }
  }, [navigate, user, authProfile, hasProfile]);

  const { profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="screen-pad prototype-my-profile">
        <div className="prototype-my-profile__body">
          <p className="aymm-muted">Set up your AYMM identity.</p>
          <Button onClick={() => navigate(withPreviewQuery('/ProfileSetup/upload-photo', { preview: '0' }))}>
            Create profile
          </Button>
        </div>
      </div>
    );
  }

  const isFamily = profile.identity_type === 'family';

  return (
    <MyProfileView
      displayName={profile.display_name}
      age={profile.age}
      identityMeta={profileIdentityMeta(profile)}
      photoUrl={profile.profile_photos?.[0]}
      bio={profile.bio}
      aboutTitle={isFamily ? 'About Us' : 'About Me'}
      answerRows={buildMyProfileAnswerRows(profile)}
      onOpenSettings={() => navigate(withPreviewQuery('/Profile/settings', { native: false, preview: '0' }))}
      onEditProfile={() => navigate(withPreviewQuery(
        profile.bio?.trim() ? '/ProfileSetup/basic-info' : '/ProfileSetup/bio',
        { preview: '0' },
      ))}
    />
  );
}