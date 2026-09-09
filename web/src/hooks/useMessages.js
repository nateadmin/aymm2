import { useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { useEntityList } from './useEntityList';

export function useMessages() {
  const { user } = useAuth();
  const sentQuery = useEntityList('Message', { from_email: user?.email }, {
    enabled: Boolean(user?.email),
    sort: '-created_at',
  });
  const receivedQuery = useEntityList('Message', { to_email: user?.email }, {
    enabled: Boolean(user?.email),
    sort: '-created_at',
  });

  const messages = useMemo(() => {
    const all = [...(sentQuery.data || []), ...(receivedQuery.data || [])];
    return all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [sentQuery.data, receivedQuery.data]);

  const letterRequests = messages.filter(
    (message) => message.is_request && message.to_email === user?.email,
  );

  const unreadCount = messages.filter(
    (message) => !message.read && message.to_email === user?.email,
  ).length;

  return {
    messages,
    letterRequests,
    unreadCount,
    isLoading: sentQuery.isLoading || receivedQuery.isLoading,
  };
}
