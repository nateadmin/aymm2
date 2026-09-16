import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useConnections } from '@/hooks/useConnections';
import { useEntityList } from '@/hooks/useEntityList';
import { getSeekingTypes } from '@/lib/matching';
import ProfileDetailModal from '@/components/shared/ProfileDetailModal';
import ProfileChatModal from '@/components/shared/ProfileChatModal';
import { useConnectionActions } from '@/hooks/useConnectionActions';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useToast } from '@/lib/toast';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';

export default function RightSidebarShell() {
  const { user, profile } = useAuth();
  const { accepted, pendingIncoming } = useConnections();
  const { push } = useToast();
  const {
    sendConnection,
    withdrawConnection,
    isPendingOutgoing,
  } = useConnectionActions();
  const sendMessage = useSendMessage();

  const [viewProfile, setViewProfile] = useState(null);
  const [messageProfile, setMessageProfile] = useState(null);
  const [messageText, setMessageText] = useState('');

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

  const handleSendMessage = async () => {
    if (!messageProfile || !messageText.trim()) return;
    await sendMessage.mutateAsync({
      toEmail: messageProfile.user_email,
      content: messageText.trim(),
    });
    setMessageProfile(null);
    setMessageText('');
  };

  return (
    <aside className="app-right-sidebar" aria-label="Secondary">
      <section className="sidebar-panel">
        <h2 className="sidebar-panel__title">At a glance</h2>
        <p>Connections: {accepted.length}</p>
        <p>Pending requests: {pendingIncoming.length}</p>
      </section>

      <section className="sidebar-panel">
        <h2 className="sidebar-panel__title">Suggested</h2>
        {suggestedProfiles.length ? (
          <ul className="sidebar-suggestions">
            {suggestedProfiles.map((item) => (
              <li key={item.id}>
                <button type="button" className="sidebar-suggestion" onClick={() => setViewProfile(item)}>
                  <img src={item.profile_photos?.[0] || PLACEHOLDER_AVATAR} alt="" />
                  <span>
                    <strong>{item.display_name}</strong>
                    <small>{item.identity_type}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="aymm-muted">No suggestions yet.</p>
        )}
      </section>

      <ProfileDetailModal
        profile={viewProfile}
        open={Boolean(viewProfile)}
        onClose={() => setViewProfile(null)}
        viewerProfile={profile}
        pendingOutgoing={viewProfile ? isPendingOutgoing(viewProfile.user_email) : false}
        onPrimaryAction={(item) => {
          if (isPendingOutgoing(item.user_email)) {
            withdrawConnection.mutate(item);
          } else {
            sendConnection.mutate(item);
          }
        }}
        onMessage={(item) => {
          setViewProfile(null);
          setMessageProfile(item);
        }}
        onChallenge={() => push('Challenge sent!', 'success')}
        onRecommend={() => push('Share link copied from profile detail.', 'success')}
        onReligion={() => push('Religion details shown in profile.', 'success')}
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
        sendingMessage={sendMessage.isPending}
      />
    </aside>
  );
}
