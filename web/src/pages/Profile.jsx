import PageShell from '@/components/PageShell';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function Profile() {
  const { logout, setIdentityType, setRole, user } = useAuth();

  return (
    <PageShell
      eyebrow="Account"
      title="Profile"
      description="Manage your profile, connections, and account settings."
    >
      <div className="page-shell__grid">
        <div className="aymm-panel">Signed in as {user?.email}</div>
        <Button variant="outline" onClick={() => setIdentityType('family')}>
          Preview family navigation
        </Button>
        <Button variant="outline" onClick={() => setIdentityType('individual')}>
          Preview individual navigation
        </Button>
        <Button variant="purple" onClick={() => setRole('admin')}>
          AYMM?
        </Button>
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </div>
    </PageShell>
  );
}
