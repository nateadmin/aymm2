import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/auth';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setHasProfile } = useAuth();

  return (
    <main className="public-page">
      <PageShell
        eyebrow="Onboarding"
        title="Profile setup"
        description="First-run profile wizard from production. Form fields and photo upload will mount in this panel."
      >
        <div className="page-shell__panel page-shell__grid">
          <label>
            Display name
            <input type="text" placeholder="Display name" />
          </label>
          <label>
            Identity type
            <select defaultValue="individual">
              <option value="individual">Individual</option>
              <option value="family">Family</option>
            </select>
          </label>
          <button
            type="button"
            className="shell-button shell-button--primary"
            onClick={() => {
              setHasProfile(true);
              navigate('/Home');
            }}
          >
            Save profile shell
          </button>
        </div>
      </PageShell>
    </main>
  );
}
