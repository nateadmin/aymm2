import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/auth';

export default function Profile() {
  const { logout, setIdentityType, setRole, user } = useAuth();

  return (
    <PageShell
      eyebrow="Account"
      title="Profile"
      description="Profile summary, settings, connections, blocks, reports, and logout from production."
    >
      <div className="page-shell__panel page-shell__grid">
        <p>Signed in as {user?.email}</p>
        <button type="button" className="shell-button" onClick={() => setIdentityType('family')}>
          Switch shell to family identity
        </button>
        <button type="button" className="shell-button" onClick={() => setIdentityType('individual')}>
          Switch shell to individual identity
        </button>
        <button type="button" className="shell-button" onClick={() => setRole('admin')}>
          Enable admin nav shell
        </button>
        <button type="button" className="shell-button shell-button--primary" onClick={logout}>
          Log out
        </button>
      </div>
    </PageShell>
  );
}
