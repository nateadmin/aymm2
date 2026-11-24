import { useAuth } from '@/lib/auth';
import { mergeProfileState } from '@/lib/session';
import { useEntityList } from './useEntityList';

export function useMyProfile() {
  const { user, profile: authProfile } = useAuth();
  const query = useEntityList('Profile', { user_email: user?.email }, {
    enabled: Boolean(user?.email),
  });

  const listProfile = query.data?.[0] ?? null;
  const profile = listProfile && authProfile
    ? mergeProfileState(listProfile, authProfile)
    : listProfile ?? authProfile ?? null;

  return {
    ...query,
    profile,
    isLoading: query.isLoading && !authProfile,
  };
}
