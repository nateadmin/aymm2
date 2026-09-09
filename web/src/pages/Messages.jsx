import PageShell from '@/components/PageShell';

export default function Messages() {
  return (
    <PageShell
      eyebrow="Inbox"
      title="Letters"
      description="Read and reply to family letters. Messaging is always called Letters in AYMM."
    >
      <div className="page-shell__grid">
        <div className="aymm-panel aymm-panel--surface">Conversation list</div>
        <div className="aymm-panel" style={{ background: 'var(--aymm-blush)' }}>Sent message bubble preview</div>
        <div className="aymm-panel">Thread composer</div>
      </div>
    </PageShell>
  );
}
