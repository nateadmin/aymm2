import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useConnections } from '@/hooks/useConnections';
import { useProfileMap } from '@/hooks/useProfileMap';
import { useEntityList } from '@/hooks/useEntityList';
import { useToast } from '@/lib/toast';
import { useAppLogout } from '@/hooks/useAppLogout';
import { SETTINGS_SECTIONS } from '@/lib/prototypeContent';
import { labelForIdentity, PLACEHOLDER_AVATAR } from '@/lib/constants';
import { formatProfileLocation } from '@/lib/profileDisplay';
import { withPreviewQuery } from '@/lib/screenCatalog';

function settingsRowAction(label) {
  switch (label) {
    case 'Edit Profile':
      return { type: 'navigate', to: '/ProfileSetup/basic-info' };
    case 'Privacy':
      return { type: 'navigate', to: '/PrivacyPolicy' };
    case 'About AYMM?':
      return { type: 'navigate', to: '/AboutUs' };
    case 'My Tables':
      return { type: 'navigate', to: '/FamilyTables' };
    case 'Report a Problem':
      return { type: 'report' };
    case 'My connections':
    case 'Help Center':
      return { type: 'connections' };
    case 'Change Password':
      return { type: 'navigate', to: '/ForgotPassword' };
    case 'Phone Number':
    case 'Email Address':
      return { type: 'contact' };
    case 'Notifications':
      return { type: 'notifications' };
    case 'Religion Preferences':
      return { type: 'navigate', to: '/ProfileSetup/religion' };
    case 'Who Can Message Me':
      return { type: 'blocks' };
    case 'Log Out':
      return { type: 'logout' };
    default:
      return null;
  }
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = useAppLogout();
  const { user } = useAuth();
  const { profile } = useMyProfile();
  const { accepted } = useConnections();
  const { getProfile } = useProfileMap();
  const { push } = useToast();

  const [showConnections, setShowConnections] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reportText, setReportText] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem('aymm_notification_prefs');
      return raw ? JSON.parse(raw) : { messages: true, tables: true, marketing: false };
    } catch {
      return { messages: true, tables: true, marketing: false };
    }
  });

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

  if (!profile) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  const photo = profile.profile_photos?.[0] || PLACEHOLDER_AVATAR;
  const role = labelForIdentity(profile.identity_type);
  const location = formatProfileLocation(profile);
  const connectionProfiles = accepted.map((connection) => {
    const email = connection.from_email === user.email ? connection.to_email : connection.from_email;
    return getProfile(email) || { user_email: email, display_name: email };
  });

  const handleRow = (label) => {
    const action = settingsRowAction(label);
    if (!action) return;
    if (action.type === 'navigate') {
      navigate(withPreviewQuery(action.to, { native: false, preview: '0' }));
      return;
    }
    if (action.type === 'logout') {
      void signOut();
      return;
    }
    if (action.type === 'report') setShowReport(true);
    if (action.type === 'connections') setShowConnections(true);
    if (action.type === 'blocks') setShowBlocks(true);
    if (action.type === 'notifications') setShowNotifications(true);
    if (action.type === 'contact') {
      push('Contact support to update account details.', 'success');
    }
  };

  const saveNotificationPrefs = (next) => {
    setNotificationPrefs(next);
    localStorage.setItem('aymm_notification_prefs', JSON.stringify(next));
  };

  return (
    <>
      <div className="screen-pad mobile-onboarding mobile-onboarding--scroll prototype-settings">
        <BackButton to={withPreviewQuery('/Profile', { native: false, preview: '0' })} />

        <h1 className="auth-heading auth-heading--brand prototype-settings__title">Settings</h1>

        <div className="prototype-settings__profile-card">
          <img src={photo} alt="" className="prototype-settings__avatar" />
          <div>
            <p className="prototype-settings__name">{profile.display_name}</p>
            <p className="prototype-settings__meta">
              {role}{location ? ` · ${location}` : ''}
            </p>
          </div>
        </div>

        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.title} className="prototype-settings__section">
            <h2 className="prototype-settings__section-title">{section.title}</h2>
            <div className="prototype-settings__list">
              {section.items.map((item) => {
                const action = settingsRowAction(item);
                if (action?.type === 'navigate') {
                  return (
                    <Link
                      key={item}
                      to={withPreviewQuery(action.to, { native: false, preview: '0' })}
                      className="prototype-settings__row"
                    >
                      <span>{item}</span>
                      <ChevronRight size={16} />
                    </Link>
                  );
                }
                if (action?.type === 'contact') {
                  return (
                    <button
                      key={item}
                      type="button"
                      className="prototype-settings__row prototype-settings__row--static"
                      onClick={() => handleRow(item)}
                    >
                      <span>{item}</span>
                    </button>
                  );
                }
                return (
                  <button
                    key={item}
                    type="button"
                    className="prototype-settings__row"
                    onClick={() => handleRow(item)}
                  >
                    <span>{item}</span>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
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

      <Modal open={showNotifications} title="Notifications" onClose={() => setShowNotifications(false)}>
        <label className="auth-field">
          <input
            type="checkbox"
            checked={notificationPrefs.messages}
            onChange={(e) => saveNotificationPrefs({ ...notificationPrefs, messages: e.target.checked })}
          />
          <span>Messages &amp; requests</span>
        </label>
        <label className="auth-field">
          <input
            type="checkbox"
            checked={notificationPrefs.tables}
            onChange={(e) => saveNotificationPrefs({ ...notificationPrefs, tables: e.target.checked })}
          />
          <span>Family table updates</span>
        </label>
        <label className="auth-field">
          <input
            type="checkbox"
            checked={notificationPrefs.marketing}
            onChange={(e) => saveNotificationPrefs({ ...notificationPrefs, marketing: e.target.checked })}
          />
          <span>News &amp; tips from AYMM</span>
        </label>
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
    </>
  );
}