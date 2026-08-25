import PageShell from '@/components/PageShell';

export default function AboutUs() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="Public"
        title="About us"
        description="Static content page from production."
      >
        <div className="page-shell__panel">About content shell.</div>
      </PageShell>
    </main>
  );
}
