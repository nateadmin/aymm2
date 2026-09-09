import BrandLockup from '@/components/brand/BrandLockup';
import PageShell from '@/components/PageShell';
import ProfileSetupWizard from '@/components/profile-setup/ProfileSetupWizard';

export default function ProfileSetup() {
  return (
    <main className="public-page">
      <BrandLockup showSubtitle={false} />
      <PageShell
        eyebrow="Onboarding"
        title="Set up your profile"
        description="Three-step wizard: basics, role-specific questions, and bio."
      >
        <ProfileSetupWizard />
      </PageShell>
    </main>
  );
}
