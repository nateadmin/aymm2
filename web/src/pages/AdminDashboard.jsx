import PageShell from '@/components/PageShell';

export default function AdminDashboard() {
  return (
    <PageShell
      eyebrow="Admin"
      title="Admin dashboard"
      description="Administrative tools for approved AYMM operators."
    >
      <div className="aymm-panel aymm-panel--surface">Admin tools area</div>
    </PageShell>
  );
}
