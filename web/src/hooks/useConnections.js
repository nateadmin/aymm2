import { useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { useEntityList } from './useEntityList';

export function useConnections() {
  const { user } = useAuth();
  const sentQuery = useEntityList('Connection', { from_email: user?.email }, {
    enabled: Boolean(user?.email),
  });
  const receivedQuery = useEntityList('Connection', { to_email: user?.email }, {
    enabled: Boolean(user?.email),
  });

  const connections = useMemo(
    () => [...(sentQuery.data || []), ...(receivedQuery.data || [])],
    [sentQuery.data, receivedQuery.data],
  );

  const accepted = connections.filter((connection) => connection.status === 'accepted');
  const pendingIncoming = connections.filter(
    (connection) => connection.status === 'pending' && connection.to_email === user?.email,
  );
  const pendingOutgoing = connections.filter(
    (connection) => connection.status === 'pending' && connection.from_email === user?.email,
  );

  return {
    connections,
    accepted,
    pendingIncoming,
    pendingOutgoing,
    isLoading: sentQuery.isLoading || receivedQuery.isLoading,
  };
}
