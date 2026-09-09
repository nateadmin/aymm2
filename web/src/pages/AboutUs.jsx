import PageShell from '@/components/PageShell';

export default function AboutUs() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="About"
        title="About AYMM"
        description="Are You My Mother connects people seeking family, guidance, and belonging."
      >
        <div className="aymm-panel">About content area</div>
      </PageShell>
    </main>
  );
}
