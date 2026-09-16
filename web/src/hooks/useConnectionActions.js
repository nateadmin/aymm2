import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import {
  findMutualPending,
  findPendingConnection,
  getConnectionTypeForProfile,
} from '@/lib/connections';
import { useConnections } from './useConnections';

export function useConnectionActions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { push } = useToast();
  const { connections, pendingOutgoing } = useConnections();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['Connection'] });
  };

  const sendConnection = useMutation({
    mutationFn: async (profile) => {
      const mutual = findMutualPending(connections, user.email, profile.user_email);
      if (mutual) {
        await entities.Connection.update(mutual.id, { status: 'accepted' });
        return { accepted: true };
      }

      const existing = findPendingConnection(connections, user.email, profile.user_email);
      if (existing) return { alreadySent: true };

      await entities.Connection.create({
        from_email: user.email,
        to_email: profile.user_email,
        type: getConnectionTypeForProfile(profile),
        status: 'pending',
      });
      return { sent: true };
    },
    onSuccess: (result) => {
      invalidate();
      if (result?.accepted) {
        push('Your request has been accepted!', 'success');
      } else if (result?.sent) {
        push('Your request has been sent.', 'success');
      }
    },
    onError: () => push('Could not send request.', 'error'),
  });

  const withdrawConnection = useMutation({
    mutationFn: async (profile) => {
      const pending = findPendingConnection(connections, user.email, profile.user_email);
      if (pending) {
        await entities.Connection.delete(pending.id);
      }
    },
    onSuccess: () => {
      invalidate();
      push('Request withdrawn.', 'success');
    },
  });

  const acceptConnection = useMutation({
    mutationFn: (connection) => entities.Connection.update(connection.id, { status: 'accepted' }),
    onSuccess: () => {
      invalidate();
      push('Connection accepted. Chat is now open.', 'success');
    },
  });

  const declineConnection = useMutation({
    mutationFn: (connection) => entities.Connection.update(connection.id, { status: 'declined' }),
    onSuccess: () => {
      invalidate();
      push('Request declined.', 'success');
    },
  });

  const isPendingOutgoing = (email) => pendingOutgoing.some((item) => item.to_email === email);

  return {
    connections,
    pendingOutgoing,
    sendConnection,
    withdrawConnection,
    acceptConnection,
    declineConnection,
    isPendingOutgoing,
  };
}
