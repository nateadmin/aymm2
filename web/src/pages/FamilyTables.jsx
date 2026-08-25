import PageShell from '@/components/PageShell';

export default function FamilyTables() {
  return (
    <PageShell
      eyebrow="Gather"
      title="Tables"
      description="Family table listings, filters, create flow, and join requests from production."
    >
      <div className="page-shell__panel">Search and filter shell</div>
      <div className="page-shell__panel">Table cards / swipe rail shell</div>
      <div className="page-shell__panel">Create table sheet shell</div>
    </PageShell>
  );
}
