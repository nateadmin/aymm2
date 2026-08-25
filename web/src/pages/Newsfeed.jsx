import PageShell from '@/components/PageShell';

export default function Newsfeed() {
  return (
    <PageShell
      eyebrow="Community"
      title="Feed"
      description="Category tabs, post cards, reactions, and create-post flow from production."
    >
      <div className="page-shell__panel">Category tabs shell</div>
      <div className="page-shell__panel">Post list shell</div>
      <div className="page-shell__panel">Create post sheet shell</div>
    </PageShell>
  );
}
