import PageShell from '@/components/PageShell';

export default function PrivacyPolicy() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="Public"
        title="Privacy policy"
        description="Static legal content page from production."
      >
        <div className="page-shell__panel">Privacy policy content shell.</div>
      </PageShell>
    </main>
  );
}
