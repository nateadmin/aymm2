import PageShell from '@/components/PageShell';

export default function Messages() {
  return (
    <PageShell
      eyebrow="Inbox"
      title="Letters"
      description="Conversation list, message requests, and thread view from production."
    >
      <div className="page-shell__panel">Conversation list shell</div>
      <div className="page-shell__panel">Thread / reply composer shell</div>
    </PageShell>
  );
}
