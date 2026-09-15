import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Send, X } from 'lucide-react';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import Button from '@/components/ui/Button';
import { MESSAGES_TABS, PLACEHOLDER_AVATAR } from '@/lib/constants';
import { useMessages } from '@/hooks/useMessages';
import { useConnections } from '@/hooks/useConnections';
import { useConnectionActions } from '@/hooks/useConnectionActions';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useProfileMap } from '@/hooks/useProfileMap';
import { useAuth } from '@/lib/auth';
import { formatRelativeTime } from '@/lib/format';

export default function Messages() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('open');
  const [selectedEmail, setSelectedEmail] = useState(location.state?.selectedConvo || null);
  const [replyText, setReplyText] = useState('');
  const { messages, letterRequests, unreadCount, isLoading } = useMessages();
  const { accepted, pendingIncoming, pendingOutgoing } = useConnections();
  const { acceptConnection, declineConnection } = useConnectionActions();
  const sendMessage = useSendMessage();
  const { getProfile } = useProfileMap();

  const acceptedEmails = useMemo(
    () => accepted.map((item) => (
      item.from_email === user.email ? item.to_email : item.from_email
    )),
    [accepted, user.email],
  );

  const conversations = useMemo(() => {
    const map = {};
    messages.forEach((message) => {
      const otherEmail = message.from_email === user.email ? message.to_email : message.from_email;
      if (!map[otherEmail]) map[otherEmail] = [];
      map[otherEmail].push(message);
    });
    return map;
  }, [messages, user.email]);

  const openConvos = Object.entries(conversations).filter(([email]) => (
    acceptedEmails.includes(email)
    || pendingOutgoing.some((item) => item.to_email === email)
  ));

  const threadMessages = selectedEmail
    ? [...(conversations[selectedEmail] || [])].sort(
      (a, b) => new Date(a.created_date) - new Date(b.created_date),
    )
    : [];

  const isApproved = selectedEmail
    ? acceptedEmails.includes(selectedEmail)
    : false;

  const badgeCounts = {
    open: unreadCount || undefined,
    requests: letterRequests.length || undefined,
    connections: pendingIncoming.length || undefined,
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;
    await sendMessage.mutateAsync({
      toEmail: selectedEmail,
      content: replyText.trim(),
    });
    setReplyText('');
  };

  if (selectedEmail) {
    const profile = getProfile(selectedEmail);
    return (
      <div className="chat-view">
        <header className="chat-view__header">
          <button type="button" className="screen-back" onClick={() => setSelectedEmail(null)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="chat-view__person">
            <img
              src={profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR}
              alt=""
              className="chat-view__avatar"
            />
            <div>
              <p className="chat-view__name">{profile?.display_name || selectedEmail}</p>
              <p className="aymm-muted">{profile?.identity_type}</p>
            </div>
          </div>
        </header>

        {!isApproved ? (
          <div className="chat-view__banner">
            This conversation is waiting for approval.
          </div>
        ) : null}

        <div className="chat-view__thread">
          {threadMessages.map((message) => {
            const mine = message.from_email === user.email;
            return (
              <div
                key={message.id}
                className={`chat-bubble${mine ? ' chat-bubble--mine' : ' chat-bubble--theirs'}`}
              >
                <p>{message.content}</p>
                <span className="chat-bubble__time">{formatRelativeTime(message.created_date)}</span>
              </div>
            );
          })}
        </div>

        <footer className="chat-view__composer">
          <textarea
            className="aymm-textarea"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your letter..."
            rows={3}
            disabled={!isApproved}
          />
          <Button
            disabled={!isApproved || !replyText.trim() || sendMessage.isPending}
            onClick={handleSendReply}
          >
            <Send size={16} />
            Send
          </Button>
        </footer>
      </div>
    );
  }

  return (
    <PageShell eyebrow="Inbox" title="Letters" description="Read and reply to family letters.">
      <TabBar tabs={MESSAGES_TABS} activeId={activeTab} onChange={setActiveTab} badgeCounts={badgeCounts} />

      {isLoading ? <p className="aymm-muted">Loading letters...</p> : null}

      {activeTab === 'open' ? (
        <div className="conversation-list">
          {openConvos.length ? openConvos.map(([email, msgs]) => {
            const profile = getProfile(email);
            const lastMsg = [...msgs].sort(
              (a, b) => new Date(b.created_date) - new Date(a.created_date),
            )[0];
            const hasUnread = msgs.some((item) => item.to_email === user.email && !item.read);
            const waiting = pendingOutgoing.some((item) => item.to_email === email);
            return (
              <button
                key={email}
                type="button"
                className="conversation-card"
                onClick={() => setSelectedEmail(email)}
              >
                <img
                  src={profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR}
                  alt=""
                  className="conversation-card__avatar"
                />
                <div className="conversation-card__body">
                  <div className="conversation-card__top">
                    <p className="conversation-card__name">{profile?.display_name || email}</p>
                    {waiting ? <span className="conversation-card__chip">Pending approval</span> : null}
                    {hasUnread ? <span className="conversation-card__dot" /> : null}
                  </div>
                  <p className="conversation-card__preview">{lastMsg?.content}</p>
                </div>
              </button>
            );
          }) : <p className="aymm-muted">No open chats yet.</p>}
        </div>
      ) : null}

      {activeTab === 'requests' ? (
        <div className="conversation-list">
          {letterRequests.length ? letterRequests.map((message) => {
            const profile = getProfile(message.from_email);
            return (
              <article key={message.id} className="conversation-card conversation-card--static">
                <img
                  src={profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR}
                  alt=""
                  className="conversation-card__avatar"
                />
                <div className="conversation-card__body">
                  <p className="conversation-card__name">{profile?.display_name || message.from_email}</p>
                  <blockquote className="conversation-card__quote">{message.content}</blockquote>
                  <p className="aymm-muted">{formatRelativeTime(message.created_date)}</p>
                </div>
              </article>
            );
          }) : <p className="aymm-muted">No letter requests.</p>}
        </div>
      ) : null}

      {activeTab === 'connections' ? (
        <div className="conversation-list">
          {pendingIncoming.length ? pendingIncoming.map((connection) => {
            const profile = getProfile(connection.from_email);
            return (
              <article key={connection.id} className="connection-card">
                <img
                  src={profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR}
                  alt=""
                  className="conversation-card__avatar"
                />
                <div className="connection-card__body">
                  <p className="conversation-card__name">{profile?.display_name || connection.from_email}</p>
                  <p className="aymm-muted">Sent you a {connection.type} request</p>
                </div>
                <div className="connection-card__actions">
                  <Button
                    onClick={() => acceptConnection.mutate(connection)}
                    disabled={acceptConnection.isPending}
                  >
                    <Check size={16} />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => declineConnection.mutate(connection)}
                    disabled={declineConnection.isPending}
                  >
                    <X size={16} />
                    Decline
                  </Button>
                </div>
              </article>
            );
          }) : <p className="aymm-muted">No pending connection requests.</p>}
        </div>
      ) : null}
    </PageShell>
  );
}
