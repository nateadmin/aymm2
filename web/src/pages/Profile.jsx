import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useMyProfile } from '@/hooks/useMyProfile';
import { labelForIdentity } from '@/lib/constants';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { profile } = useMyProfile();

  const menuItems = [
    ...(isAdmin ? [{ label: 'Admin Dashboard', to: '/AdminDashboard' }] : []),
    { label: 'Edit Profile', to: '/ProfileSetup' },
    { label: 'Connections', action: 'connections' },
    { label: 'About Us', to: '/AboutUs' },
    { label: 'Privacy Policy', to: '/PrivacyPolicy' },
    { label: 'Report a Problem', action: 'report' },
    { label: 'Block List', action: 'blocks' },
  ];

  return (
    <PageShell
      eyebrow="Account"
      title="Profile"
      description="Your AYMM identity, connections, and account settings."
    >
      <PlaceholderPanel title={profile?.display_name || user?.email}>
        <p>
          I am a {labelForIdentity(profile?.identity_type || 'member')}
          {profile?.seeking_types?.length ? ` seeking ${profile.seeking_types.join(', ')}` : ''}
        </p>
        <p className="aymm-muted">{profile?.location || 'Location not set'}</p>
        <div className="aymm-panel aymm-panel--surface">{profile?.bio || 'Bio not set yet.'}</div>
      </PlaceholderPanel>

      <div className="page-shell__grid">
        {menuItems.map((item) => (
          item.to ? (
            <Link key={item.label} className="aymm-button aymm-button--outline" to={item.to}>{item.label}</Link>
          ) : (
            <button key={item.label} type="button" className="aymm-button aymm-button--outline">
              {item.label}
            </button>
          )
        ))}
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            navigate('/Welcome');
          }}
        >
          Logout
        </Button>
      </div>
    </PageShell>
  );
}
