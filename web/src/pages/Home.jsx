import PageShell from '@/components/PageShell';

export default function Home() {
  return (
    <PageShell
      eyebrow="Discover"
      title="Home"
      description="Swipe through profiles and send AYMM?, AYMF?, or Adopt connection requests."
    >
      <div className="page-shell__grid">
        <div className="aymm-panel aymm-panel--surface">Profile carousel selector</div>
        <div className="aymm-panel">Selected profile detail</div>
        <div className="page-shell__grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <button type="button" className="aymm-pill-action">Msg</button>
          <button type="button" className="aymm-pill-action">Challenge</button>
          <button type="button" className="aymm-pill-action">Recommend</button>
          <button type="button" className="aymm-pill-action">Religion</button>
        </div>
      </div>
    </PageShell>
  );
}
