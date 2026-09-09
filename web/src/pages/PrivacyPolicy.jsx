import PageShell from '@/components/PageShell';

export default function PrivacyPolicy() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="Legal"
        title="Privacy policy"
        description="How AYMM collects, uses, and protects your information."
      >
        <div className="aymm-panel">Privacy policy content area</div>
      </PageShell>
    </main>
  );
}
