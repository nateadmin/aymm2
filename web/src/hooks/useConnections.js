import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { useAuth } from '@/lib/auth';

export function useConnections() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['Connection', 'mine', user?.email],
    queryFn: () => api.get('/api/connections/mine'),
    enabled: Boolean(user?.email),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const connections = useMemo(() => query.data || [], [query.data]);

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
    isLoading: query.isLoading,
  };
}