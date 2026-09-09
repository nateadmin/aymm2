import PageShell from '@/components/PageShell';

export default function FamilyTables() {
  return (
    <PageShell
      eyebrow="Gather"
      title="Family Tables"
      description="Browse and host family table gatherings. Never labeled as Events in the product."
    >
      <div className="page-shell__grid">
        <div className="aymm-panel aymm-panel--surface">Search and filters</div>
        <div className="aymm-panel">Family table cards</div>
        <div className="aymm-panel">Create table flow</div>
      </div>
    </PageShell>
  );
}
