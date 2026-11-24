import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuth } from '@/lib/auth';
import { mergeProfileState } from '@/lib/session';

export function useMyProfile() {
  const { user, profile: authProfile } = useAuth();
  const query = useQuery({
    queryKey: ['Profile', 'me', user?.email],
    queryFn: async () => {
      const { profile } = await profileApi.getMine();
      return profile ?? null;
    },
    enabled: Boolean(user?.email),
    staleTime: 0,
  });

  const fromMe = query.data ?? null;
  const profile = fromMe && authProfile
    ? mergeProfileState(fromMe, authProfile)
    : fromMe ?? authProfile ?? null;

  return {
    ...query,
    profile,
    isLoading: query.isLoading && !authProfile,
  };
}