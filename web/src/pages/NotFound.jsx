import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

export default function NotFound() {
  return (
    <main className="public-page">
      <PageShell eyebrow="404" title="Page not found" description="This route is not registered in the app shell.">
        <Link className="shell-link" to="/Welcome">Back to welcome</Link>
      </PageShell>
    </main>
  );
}
