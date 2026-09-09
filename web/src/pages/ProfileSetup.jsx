import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLockup from '@/components/brand/BrandLockup';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/auth';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setHasProfile } = useAuth();

  return (
    <main className="public-page">
      <BrandLockup showSubtitle={false} />

      <PageShell
        eyebrow="Onboarding"
        title="Set up your profile"
        description="Tell us who you are so we can match you with the right family connections."
      >
        <div className="page-shell__grid">
          <TextField label="Display name" name="displayName" placeholder="Your name" />
          <label className="aymm-field">
            <span className="aymm-label">Identity type</span>
            <select className="aymm-select" defaultValue="individual">
              <option value="individual">Individual</option>
              <option value="family">Family</option>
            </select>
          </label>
          <Button
            onClick={() => {
              setHasProfile(true);
              navigate('/Home');
            }}
          >
            Continue
          </Button>
        </div>
      </PageShell>
    </main>
  );
}
