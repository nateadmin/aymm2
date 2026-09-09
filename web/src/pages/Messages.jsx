import React, { useState } from 'react';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import { MESSAGES_TABS } from '@/lib/constants';
import { useMessages } from '@/hooks/useMessages';
import { useConnections } from '@/hooks/useConnections';

export default function Messages() {
  const [activeTab, setActiveTab] = useState('open');
  const { messages, letterRequests, unreadCount, isLoading } = useMessages();
  const { pendingIncoming } = useConnections();

  const badgeCounts = {
    open: unreadCount || undefined,
    requests: letterRequests.length || undefined,
    connections: pendingIncoming.length || undefined,
  };

  return (
    <PageShell
      eyebrow="Inbox"
      title="Letters"
      description="Read and reply to family letters. Messaging is always called Letters in AYMM."
    >
      <TabBar tabs={MESSAGES_TABS} activeId={activeTab} onChange={setActiveTab} badgeCounts={badgeCounts} />

      {isLoading ? <PlaceholderPanel title="Loading letters" /> : null}

      {activeTab === 'open' ? (
        <div className="page-shell__grid">
          <PlaceholderPanel title="Open conversations" description="Merged threads with accepted connections or outgoing pending requests.">
            {messages.length ? messages.map((message) => (
              <p key={message.id}>{message.from_email} → {message.to_email}: {message.content}</p>
            )) : <p className="aymm-muted">No open conversations yet.</p>}
          </PlaceholderPanel>
          <PlaceholderPanel title="Chat view" description="Bubble thread and composer placeholder." />
        </div>
      ) : null}

      {activeTab === 'requests' ? (
        <PlaceholderPanel title="Letter requests" description="Inbound is_request messages from non-connected users.">
          {letterRequests.length ? letterRequests.map((message) => (
            <blockquote key={message.id}>{message.content}</blockquote>
          )) : <p className="aymm-muted">No letter requests.</p>}
        </PlaceholderPanel>
      ) : null}

      {activeTab === 'connections' ? (
        <PlaceholderPanel title="Pending connection requests" description="Accept or decline inbound AYMM requests.">
          {pendingIncoming.length ? pendingIncoming.map((connection) => (
            <p key={connection.id}>{connection.from_email} sent a {connection.type} request</p>
          )) : <p className="aymm-muted">No pending connection requests.</p>}
        </PlaceholderPanel>
      ) : null}
    </PageShell>
  );
}
