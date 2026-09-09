import PageShell from '@/components/PageShell';

export default function Newsfeed() {
  return (
    <PageShell
      eyebrow="Community"
      title="Feed"
      description="Share stories, photos, and updates with your AYMM community."
    >
      <div className="page-shell__grid">
        <div className="aymm-panel aymm-panel--surface">Category tabs</div>
        <div className="aymm-panel">Post cards</div>
        <div className="aymm-panel">Create post sheet</div>
      </div>
    </PageShell>
  );
}
