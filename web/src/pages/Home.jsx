import PageShell from '@/components/PageShell';

export default function Home() {
  return (
    <PageShell
      eyebrow="Discover"
      title="Home"
      description="Swipe rail and profile discovery from production. Hidden for family identity users, who land on Feed instead."
    >
      <div className="page-shell__panel">Swipe rail shell</div>
      <div className="page-shell__panel">Profile detail modal shell</div>
      <div className="page-shell__panel">Message request modal shell</div>
    </PageShell>
  );
}
