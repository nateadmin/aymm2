import { useMemo } from 'react';
import { useEntityList } from './useEntityList';

export function useProfileMap(options = {}) {
  const profilesQuery = useEntityList('Profile', {}, {
    enabled: options.enabled ?? true,
    limit: options.limit ?? 200,
  });

  const profileMap = useMemo(() => {
    const map = new Map();
    (profilesQuery.data || []).forEach((profile) => {
      map.set(profile.user_email, profile);
    });
    return map;
  }, [profilesQuery.data]);

  const getProfile = (email) => profileMap.get(email) || null;

  return {
    profiles: profilesQuery.data || [],
    profileMap,
    getProfile,
    isLoading: profilesQuery.isLoading,
  };
}
