import PageShell from '@/components/PageShell';

export default function AdminDashboard() {
  return (
    <PageShell
      eyebrow="Admin"
      title="Admin dashboard"
      description="Admin-only route from production. Visible when the signed-in user has admin role."
    >
      <div className="page-shell__panel">Admin tools shell</div>
    </PageShell>
  );
}
