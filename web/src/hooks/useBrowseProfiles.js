import { useMemo } from 'react';
import { mergeBrowseProfiles } from '@/lib/demoProfiles';
import { filterMatchedProfiles, sortProfilesByDistance } from '@/lib/matching';
import { useEntityList } from './useEntityList';
import { useMyProfile } from './useMyProfile';

export function useBrowseProfiles() {
  const { profile: myProfile, isLoading: profileLoading } = useMyProfile();
  const profilesQuery = useEntityList('Profile', {}, {
    enabled: Boolean(myProfile),
    sort: '-created_at',
    limit: 200,
  });

  const browseProfiles = useMemo(() => {
    if (!myProfile) return [];
    const matched = filterMatchedProfiles(myProfile, profilesQuery.data || []);
    const sorted = sortProfilesByDistance(matched, myProfile);
    return mergeBrowseProfiles(sorted, myProfile.identity_type);
  }, [myProfile, profilesQuery.data]);

  return {
    myProfile,
    browseProfiles,
    isLoading: profileLoading || profilesQuery.isLoading,
    isEmpty: browseProfiles.length === 0,
  };
}
