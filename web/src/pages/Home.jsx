import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import SwipeRail from '@/components/shared/SwipeRail';
import ProfileCard from '@/components/shared/ProfileCard';
import ProfileDetailModal from '@/components/shared/ProfileDetailModal';
import ProfileChatModal from '@/components/shared/ProfileChatModal';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useBrowseProfiles } from '@/hooks/useBrowseProfiles';
import { useConnections } from '@/hooks/useConnections';
import {
  findMutualPending,
  findPendingConnection,
  getConnectionTypeForProfile,
  isConnected,
} from '@/lib/connections';
import { useToast } from '@/lib/toast';

export default function Home() {
  const { user } = useAuth();
  const { push } = useToast();
  const queryClient = useQueryClient();
  const { myProfile, browseProfiles, isLoading, isEmpty } = useBrowseProfiles();
  const { connections } = useConnections();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [messageProfile, setMessageProfile] = useState(null);
  const [messageText, setMessageText] = useState('');

  const connectionMutation = useMutation({
    mutationFn: async (profile) => {
      if (profile.is_demo) return null;
      const mutual = findMutualPending(connections, user.email, profile.user_email);
      if (mutual) {
        return entities.Connection.update(mutual.id, { status: 'accepted' });
      }
      const existing = findPendingConnection(connections, user.email, profile.user_email);
      if (existing) return existing;
      return entities.Connection.create({
        from_email: user.email,
        to_email: profile.user_email,
        type: getConnectionTypeForProfile(profile),
        status: 'pending',
      });
    },
    onSuccess: (result, profile) => {
      queryClient.invalidateQueries({ queryKey: ['Connection'] });
      if (result?.status === 'accepted') {
        push(`You and ${profile.display_name} are connected!`, 'success');
      } else {
        push('Connection request sent.', 'success');
      }
    },
    onError: () => push('Could not send connection request.', 'error'),
  });

  const messageMutation = useMutation({
    mutationFn: async (profile) => {
      const connected = isConnected(connections, user.email, profile.user_email);
      return entities.Message.create({
        from_email: user.email,
        to_email: profile.user_email,
        content: messageText,
        is_request: !connected,
      });
    },
    onSuccess: () => {
      setMessageText('');
      setMessageProfile(null);
      queryClient.invalidateQueries({ queryKey: ['Message'] });
      push('Letter sent.', 'success');
    },
    onError: () => push('Could not send letter.', 'error'),
  });

  const handleSecondary = (label) => {
    push(`${label} action placeholder.`, 'info');
  };

  return (
    <PageShell
      eyebrow="Discover"
      title="Home"
      description="Swipe through profiles and send AYMM?, AYMF?, or Adopt connection requests."
    >
      {isLoading ? <PlaceholderPanel title="Loading matches" /> : null}
      {isEmpty ? <PlaceholderPanel title="No matches yet" description="Adjust your seeking types or check back later." /> : null}
      <SwipeRail
        items={browseProfiles}
        emptyLabel="No profiles in your browse rail."
        renderItem={(profile) => (
          <ProfileCard
            profile={profile}
            viewerProfile={myProfile}
            pendingOutgoing={Boolean(findPendingConnection(connections, user.email, profile.user_email))}
            onOpen={setSelectedProfile}
            onPrimaryAction={(item) => connectionMutation.mutate(item)}
            onMessage={(item) => setMessageProfile(item)}
            onChallenge={() => handleSecondary('Challenge')}
            onRecommend={() => handleSecondary('Recommend')}
            onReligion={() => handleSecondary('Religion')}
          />
        )}
      />
      <ProfileDetailModal
        profile={selectedProfile}
        open={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
        viewerProfile={myProfile}
        pendingOutgoing={selectedProfile ? Boolean(findPendingConnection(connections, user.email, selectedProfile.user_email)) : false}
        onPrimaryAction={(item) => connectionMutation.mutate(item)}
        onMessage={(item) => setMessageProfile(item)}
        onChallenge={() => handleSecondary('Challenge')}
        onRecommend={() => handleSecondary('Recommend')}
        onReligion={() => handleSecondary('Religion')}
      />
      <ProfileChatModal
        profile={messageProfile}
        open={Boolean(messageProfile)}
        onClose={() => {
          setMessageProfile(null);
          setMessageText('');
        }}
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSend={() => messageMutation.mutate(messageProfile)}
        isLocked={messageProfile ? !isConnected(connections, user.email, messageProfile.user_email) : false}
        sendingMessage={messageMutation.isPending}
      />
    </PageShell>
  );
}
