import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeartLogo from '@/components/brand/HeartLogo';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { useBrowseProfiles } from '@/hooks/useBrowseProfiles';
import { useMessages } from '@/hooks/useMessages';

const QUICK_ACTIONS = [
  {
    title: 'Browse Profiles',
    description: 'Discover family connections',
    to: '/Newsfeed',
  },
  {
    title: 'Family Tables',
    description: 'Join a gathering near you',
    to: '/FamilyTables',
  },
  {
    title: 'Letters',
    description: 'Unread messages',
    to: '/Messages',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { browseProfiles } = useBrowseProfiles();
  const { unreadCount } = useMessages();

  const railProfiles = browseProfiles.slice(0, 6);

  return (
    <div className="screen-pad" style={{ paddingTop: '1.5rem' }}>
      <header className="home-header">
        <div>
          <h1 className="home-header__title">Good morning</h1>
          <p className="home-header__subtitle">Find your family connection</p>
        </div>
        <HeartLogo className="home-header__heart" />
      </header>

      <section>
        <h2 className="home-section-title">Profiles near you</h2>
        <div className="profile-rail">
          {railProfiles.map((profile) => (
            <button
              key={profile.id || profile.user_email}
              type="button"
              className="profile-rail-card"
              onClick={() => navigate('/Newsfeed')}
            >
              <img
                src={profile.profile_photos?.[0] || PLACEHOLDER_AVATAR}
                alt=""
                className="profile-rail-card__photo"
              />
              <div className="profile-rail-card__meta">
                <p className="profile-rail-card__name">
                  {profile.display_name}{profile.age ? `, ${profile.age}` : ''}
                </p>
                <p className="profile-rail-card__detail">
                  {profile.identity_type}
                  {profile.location ? ` · ${profile.location}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="home-section-title">Quick actions</h2>
        <div className="quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              type="button"
              className="quick-action-card"
              onClick={() => navigate(action.to)}
            >
              <div>
                <p className="quick-action-card__title">{action.title}</p>
                <p className="quick-action-card__desc">
                  {action.title === 'Letters' && unreadCount
                    ? `${unreadCount} unread messages`
                    : action.description}
                </p>
              </div>
              <ChevronRight className="quick-action-card__chevron" size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
