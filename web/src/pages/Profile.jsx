import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useConnections } from '@/hooks/useConnections';
import { useProfileMap } from '@/hooks/useProfileMap';
import { useEntityList } from '@/hooks/useEntityList';
import { useToast } from '@/lib/toast';
import { CHILD_IDENTITIES, PARENT_IDENTITIES, PLACEHOLDER_AVATAR, labelForIdentity } from '@/lib/constants';

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, logout } = useAuth();
  const { profile, isLoading } = useMyProfile();
  const { accepted } = useConnections();
  const { getProfile } = useProfileMap();
  const { push } = useToast();

  const [showConnections, setShowConnections] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState('');

  const blocksQuery = useEntityList('Block', { blocker_email: user?.email }, {
    enabled: Boolean(user?.email),
  });

  const unblockUser = useMutation({
    mutationFn: (blockId) => entities.Block.delete(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Block'] });
      push('User unblocked.', 'success');
    },
  });

  const submitReport = useMutation({
    mutationFn: () => entities.Report.create({
      reporter_email: user.email,
      report_type: 'profile',
      reason: reportText.trim(),
      status: 'pending',
    }),
    onSuccess: () => {
      setShowReport(false);
      setReportText('');
      push('Report submitted.', 'success');
    },
  });

  const menuItems = [
    ...(isAdmin ? [{ label: 'Admin Dashboard', to: '/AdminDashboard' }] : []),
    { label: 'Edit Profile', to: '/ProfileSetup/basic-info' },
    { label: `Connections (${accepted.length})`, action: 'connections' },
    { label: 'About Us', to: '/AboutUs' },
    { label: 'Privacy Policy', to: '/PrivacyPolicy' },
    { label: 'Report a Problem', action: 'report' },
    { label: 'Block List', action: 'blocks' },
  ];

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!profile) {
    return (
      <PageShell eyebrow="Account" title="Profile" description="Set up your AYMM identity.">
        <Button onClick={() => navigate('/ProfileSetup/upload-photo')}>Create profile</Button>
      </PageShell>
    );
  }

  const isChild = CHILD_IDENTITIES.includes(profile.identity_type);
  const isParent = PARENT_IDENTITIES.includes(profile.identity_type);
  const isFamily = profile.identity_type === 'family';
  const accentClass = isChild ? 'profile-bio--child' : isParent ? 'profile-bio--parent' : 'profile-bio--family';

  const connectionProfiles = accepted.map((connection) => {
    const email = connection.from_email === user.email ? connection.to_email : connection.from_email;
    return getProfile(email) || { user_email: email, display_name: email };
  });

  return (
    <PageShell eyebrow="Account" title="Profile" description="Your AYMM identity, connections, and account settings.">
      <div className="profile-page">
        <img
          src={profile.profile_photos?.[0] || PLACEHOLDER_AVATAR}
          alt=""
          className="profile-page__photo"
        />

        <div className="profile-page__card">
          <h2 className="profile-page__name">{profile.display_name}</h2>
          <p className="profile-page__role">
            I am a {labelForIdentity(profile.identity_type)}
            {profile.seeking_types?.length
              ? ` seeking ${profile.seeking_types.map(labelForIdentity).join(', ')}`
              : ''}
          </p>
          <p className="aymm-muted">
            {profile.location}
            {profile.zipcode ? ` · ${profile.zipcode}` : ''}
          </p>
        </div>

        {profile.bio ? (
          <div className={`profile-bio ${accentClass}`}>
            <h3>About {isFamily ? 'Us' : 'Me'}</h3>
            <p>{profile.bio}</p>
          </div>
        ) : null}

        <div className="profile-details">
          {profile.seeking_for?.length ? (
            <div>
              <p className="profile-details__label">Seeking for</p>
              <p>{profile.seeking_for.join(', ')}</p>
            </div>
          ) : null}
          {profile.favorite_foods ? (
            <div>
              <p className="profile-details__label">Favorite foods</p>
              <p>{profile.favorite_foods}</p>
            </div>
          ) : null}
          {profile.hobbies ? (
            <div>
              <p className="profile-details__label">Hobbies</p>
              <p>{profile.hobbies}</p>
            </div>
          ) : null}
          {profile.last_book ? (
            <div>
              <p className="profile-details__label">Last book</p>
              <p>{profile.last_book}</p>
            </div>
          ) : null}
          {profile.last_movie ? (
            <div>
              <p className="profile-details__label">Last movie</p>
              <p>{profile.last_movie}</p>
            </div>
          ) : null}
        </div>

        <div className="profile-menu">
          {menuItems.map((item) => (
            item.to ? (
              <Link key={item.label} className="profile-menu__item" to={item.to}>{item.label}</Link>
            ) : (
              <button
                key={item.label}
                type="button"
                className="profile-menu__item"
                onClick={() => {
                  if (item.action === 'connections') setShowConnections(true);
                  if (item.action === 'report') setShowReport(true);
                  if (item.action === 'blocks') setShowBlocks(true);
                }}
              >
                {item.label}
              </button>
            )
          ))}
          <button
            type="button"
            className="profile-menu__item profile-menu__item--logout"
            onClick={async () => {
              await logout();
              navigate('/Welcome');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <Modal open={showConnections} title="Connections" onClose={() => setShowConnections(false)}>
        {connectionProfiles.length ? (
          <ul className="connection-list">
            {connectionProfiles.map((item) => (
              <li key={item.user_email} className="connection-list__item">
                <img src={item.profile_photos?.[0] || PLACEHOLDER_AVATAR} alt="" />
                <span>{item.display_name}</span>
              </li>
            ))}
          </ul>
        ) : <p className="aymm-muted">No connections yet.</p>}
      </Modal>

      <Modal open={showBlocks} title="Block list" onClose={() => setShowBlocks(false)}>
        {(blocksQuery.data || []).length ? (
          <ul className="connection-list">
            {(blocksQuery.data || []).map((block) => (
              <li key={block.id} className="connection-list__item">
                <span>{block.blocked_name || block.blocked_email}</span>
                <Button variant="outline" onClick={() => unblockUser.mutate(block.id)}>Unblock</Button>
              </li>
            ))}
          </ul>
        ) : <p className="aymm-muted">No blocked users.</p>}
      </Modal>

      <Modal open={showReport} title="Report a problem" onClose={() => setShowReport(false)}>
        <textarea
          className="aymm-textarea"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          rows={5}
          placeholder="Describe the issue..."
        />
        <Button disabled={!reportText.trim() || submitReport.isPending} onClick={() => submitReport.mutate()}>
          Submit report
        </Button>
      </Modal>
    </PageShell>
  );
}
