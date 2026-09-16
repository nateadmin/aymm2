import { useAuth } from '@/lib/auth';
import { useEntityList } from './useEntityList';

export function useMyProfile() {
  const { user } = useAuth();
  const query = useEntityList('Profile', { user_email: user?.email }, {
    enabled: Boolean(user?.email),
  });

  return {
    ...query,
    profile: query.data?.[0] || null,
  };
}
