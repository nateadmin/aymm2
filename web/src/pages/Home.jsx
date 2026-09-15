import React, { useState } from 'react';
import ProfileCard from '@/components/shared/ProfileCard';
import ProfileDetailModal from '@/components/shared/ProfileDetailModal';
import ProfileChatModal from '@/components/shared/ProfileChatModal';
import SwipeRail from '@/components/shared/SwipeRail';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useBrowseProfiles } from '@/hooks/useBrowseProfiles';
import { useConnectionActions } from '@/hooks/useConnectionActions';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { formatLabel } from '@/lib/format';

export default function Home() {
  const { push } = useToast();
  const { profile: authProfile } = useAuth();
  const { myProfile, browseProfiles, isLoading, isEmpty } = useBrowseProfiles();
  const activeProfile = myProfile || authProfile;
  const {
    connections,
    sendConnection,
    withdrawConnection,
    isPendingOutgoing,
  } = useConnectionActions();
  const sendMessage = useSendMessage();
  const { messages } = useMessages();

  const [viewProfile, setViewProfile] = useState(null);
  const [messageProfile, setMessageProfile] = useState(null);
  const [religionProfile, setReligionProfile] = useState(null);
  const [shareProfile, setShareProfile] = useState(null);
  const [messageText, setMessageText] = useState('');

  const pendingMessageRequest = messageProfile
    ? messages.some((item) => item.from_email && item.to_email === messageProfile.user_email && item.is_request)
    : false;

  const handlePrimaryAction = (profile) => {
    if (profile.is_demo) return;
    if (isPendingOutgoing(profile.user_email)) {
      withdrawConnection.mutate(profile);
      return;
    }
    sendConnection.mutate(profile);
  };

  const handleSendMessage = async () => {
    if (!messageProfile || !messageText.trim()) return;
    await sendMessage.mutateAsync({
      toEmail: messageProfile.user_email,
      content: messageText.trim(),
    });
    setMessageProfile(null);
    setMessageText('');
  };

  if (isLoading && !activeProfile) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="screen-pad browse-page">
      <header className="browse-hero">
        <h1 className="browse-hero__title">AYMM?</h1>
        <p className="browse-hero__subtitle">Find your family connection</p>
      </header>

      {isEmpty ? (
        <div className="browse-empty">
          <p>No matching profiles yet.</p>
          <p className="aymm-muted">Check back soon as more families join.</p>
        </div>
      ) : (
        <section>
          <h2 className="home-section-title">Profiles</h2>
          <SwipeRail
            items={browseProfiles}
            emptyLabel="No profiles to show."
            renderItem={(profile) => (
              <ProfileCard
                profile={profile}
                viewerProfile={activeProfile}
                pendingOutgoing={isPendingOutgoing(profile.user_email)}
                onOpen={setViewProfile}
                onPrimaryAction={handlePrimaryAction}
                onMessage={(item) => {
                  if (!item.is_demo) setMessageProfile(item);
                }}
                onChallenge={() => push('Challenge sent!', 'success')}
                onRecommend={(item) => {
                  if (!item.is_demo) setShareProfile(item);
                }}
                onReligion={(item) => {
                  if (!item.is_demo) setReligionProfile(item);
                }}
              />
            )}
          />
        </section>
      )}

      <ProfileDetailModal
        profile={viewProfile}
        open={Boolean(viewProfile)}
        onClose={() => setViewProfile(null)}
        viewerProfile={activeProfile}
        pendingOutgoing={viewProfile ? isPendingOutgoing(viewProfile.user_email) : false}
        onPrimaryAction={handlePrimaryAction}
        onMessage={(item) => {
          setViewProfile(null);
          setMessageProfile(item);
        }}
        onChallenge={() => push('Challenge sent!', 'success')}
        onRecommend={setShareProfile}
        onReligion={setReligionProfile}
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
        onSend={handleSendMessage}
        isLocked={pendingMessageRequest}
        sendingMessage={sendMessage.isPending}
      />

      <Modal
        open={Boolean(religionProfile)}
        title="Religion"
        onClose={() => setReligionProfile(null)}
      >
        <p>
          {religionProfile?.religion_private
            ? 'This user has set their religion to private.'
            : formatLabel(religionProfile?.religion) || 'Not specified'}
        </p>
      </Modal>

      <Modal
        open={Boolean(shareProfile)}
        title={`Share ${shareProfile?.display_name || 'profile'}`}
        onClose={() => setShareProfile(null)}
      >
        <p className="aymm-muted">Copy this link to share their profile.</p>
        <TextField
          label="Profile link"
          name="share"
          value={`${window.location.origin}?profile=${shareProfile?.id || ''}`}
          readOnly
        />
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(`${window.location.origin}?profile=${shareProfile?.id}`);
            push('Link copied!', 'success');
            setShareProfile(null);
          }}
        >
          Copy link
        </Button>
      </Modal>
    </div>
  );
}
