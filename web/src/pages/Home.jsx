import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withPreviewQuery } from '@/lib/screenCatalog';
import HomeHubLayout, { timeOfDayGreeting } from '@/components/home/HomeHubLayout';
import QuickActionList from '@/components/home/QuickActionList';
import { LIVE_QUICK_ACTIONS } from '@/lib/homeQuickActions';
import ProfileDetailModal from '@/components/shared/ProfileDetailModal';
import ProfileChatModal from '@/components/shared/ProfileChatModal';
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
import { PLACEHOLDER_AVATAR } from '@/lib/constants';

function profileLocation(profile) {
  const parts = [profile.city, profile.state].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return 'Near you';
}

function profileRailDetail(profile) {
  const role = formatLabel(profile.identity_type) || 'Member';
  return `${role} · ${profileLocation(profile)}`;
}

export default function Home() {
  const navigate = useNavigate();
  const profilesSectionRef = useRef(null);
  const { push } = useToast();
  const { profile: authProfile, user, hasProfile } = useAuth();

  const { myProfile, browseProfiles, isLoading, isEmpty } = useBrowseProfiles();
  const activeProfile = myProfile || authProfile;
  const {
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

  const greeting = useMemo(() => {
    const name = activeProfile?.display_name?.trim();
    const salutation = timeOfDayGreeting();
    return name ? `${salutation}, ${name.split(' ')[0]}` : salutation;
  }, [activeProfile?.display_name]);

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

  const handleQuickAction = (action) => {
    if (action.scrollToProfiles) {
      profilesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (browseProfiles.length > 0) {
        const first = browseProfiles.find((p) => !p.is_demo) || browseProfiles[0];
        setViewProfile(first);
      }
      return;
    }
    navigate(withPreviewQuery(action.route, { native: false, preview: '0' }));
  };

  if (isLoading && !activeProfile) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <>
      <HomeHubLayout
        greeting={greeting}
        profilesRail={(
          <div ref={profilesSectionRef}>
            {isEmpty ? (
              <div className="browse-empty">
                <p>No matching profiles yet.</p>
                <p className="aymm-muted">Check back soon as more families join.</p>
              </div>
            ) : (
              <div className="profile-rail">
                {browseProfiles.map((profile) => (
                  <button
                    key={profile.id || profile.user_email}
                    type="button"
                    className="profile-rail-card"
                    onClick={() => setViewProfile(profile)}
                  >
                    <img
                      src={profile.profile_photos?.[0] || PLACEHOLDER_AVATAR}
                      alt=""
                      className="profile-rail-card__photo"
                    />
                    <div className="profile-rail-card__meta">
                      <p className="profile-rail-card__name">
                        {profile.display_name}
                        {profile.age ? `, ${profile.age}` : ''}
                      </p>
                      <p className="profile-rail-card__detail">
                        {profileRailDetail(profile)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        quickActions={(
          <QuickActionList actions={LIVE_QUICK_ACTIONS} onAction={handleQuickAction} />
        )}
      />

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
    </>
  );
}