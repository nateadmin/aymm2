import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

export default function NotFound() {
  return (
    <main className="public-page">
      <PageShell eyebrow="404" title="Page not found" description="This screen is not part of the AYMM app map.">
        <Link className="aymm-button aymm-button--outline" to="/Welcome">Back to welcome</Link>
      </PageShell>
    </main>
  );
}
