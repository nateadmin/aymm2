import { useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { useConnections } from '@/hooks/useConnections';
import { useEntityList } from '@/hooks/useEntityList';
import { getSeekingTypes } from '@/lib/matching';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';

export default function RightSidebarShell() {
  const { user, profile } = useAuth();
  const { accepted, pendingIncoming } = useConnections();
  const profilesQuery = useEntityList('Profile', {}, {
    enabled: Boolean(user?.email),
    limit: 100,
  });

  const suggestedProfiles = useMemo(() => {
    if (!profile) return [];
    const seekingTypes = getSeekingTypes(profile);
    return (profilesQuery.data || [])
      .filter((item) => item.user_email !== user?.email)
      .filter((item) => seekingTypes.length === 0 || seekingTypes.includes(item.identity_type))
      .slice(0, 5);
  }, [profile, profilesQuery.data, user?.email]);

  return (
    <aside className="app-right-sidebar" aria-label="Secondary">
      <PlaceholderPanel title="At a glance">
        <p>Connections: {accepted.length}</p>
        <p>Pending requests: {pendingIncoming.length}</p>
      </PlaceholderPanel>
      <PlaceholderPanel title="Suggested" description="Opens profile detail and message modals when wired.">
        {suggestedProfiles.length ? (
          <ul className="page-shell__grid">
            {suggestedProfiles.map((item) => (
              <li key={item.id}>{item.display_name} · {item.identity_type}</li>
            ))}
          </ul>
        ) : (
          <p className="aymm-muted">No suggestions yet.</p>
        )}
      </PlaceholderPanel>
    </aside>
  );
}
