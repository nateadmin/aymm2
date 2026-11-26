import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuth } from '@/lib/auth';
import { emailsMatch } from '@/lib/connections';
import { resolveProfileBio } from '@/lib/profileDisplay';

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
  const profile = useMemo(() => {
    const accountEmail = user?.email;
    const authMatches = authProfile && accountEmail
      && emailsMatch(authProfile.user_email, accountEmail);
    const meMatches = fromMe && accountEmail && emailsMatch(fromMe.user_email, accountEmail);

    const base = meMatches ? fromMe : authMatches ? authProfile : fromMe ?? authProfile ?? null;
    if (!base) return null;
  if (accountEmail && base.user_email && !emailsMatch(base.user_email, accountEmail)) {
      return null;
    }
    return {
      ...base,
      bio: resolveProfileBio(authProfile, base) || base.bio,
    };
  }, [fromMe, authProfile, user?.email]);

  const profileMismatch = Boolean(
    user?.email
    && authProfile?.user_email
    && !emailsMatch(authProfile.user_email, user.email),
  );

  return {
    ...query,
    profile,
    isLoading: (query.isLoading && !profile) || profileMismatch,
  };
}