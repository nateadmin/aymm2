import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { isConnected } from '@/lib/connections';
import { useConnections } from './useConnections';

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { push } = useToast();
  const { connections } = useConnections();

  const sendMessage = useMutation({
    mutationFn: async ({ toEmail, content, forceRequest = false }) => {
      const connected = isConnected(connections, user.email, toEmail);
      await entities.Message.create({
        from_email: user.email,
        to_email: toEmail,
        content,
        is_request: forceRequest || !connected,
      });
      return { connected };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['Message'] });
      push(result.connected ? 'Message sent!' : 'Message request sent.', 'success');
    },
    onError: () => push('Could not send message.', 'error'),
  });

  return sendMessage;
}
