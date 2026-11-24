import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import HomeHubLayout from '@/components/home/HomeHubLayout';
import QuickActionList from '@/components/home/QuickActionList';
import { HOME_PROFILES, QUICK_ACTIONS } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function PrototypeHome() {
  const navigate = useNavigate();

  return (
    <PrototypeScreen>
      <HomeHubLayout
        greeting="Good morning"
        profilesRail={(
          <div className="profile-rail">
            {HOME_PROFILES.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className="profile-rail-card"
                onClick={() => navigate(withPreviewQuery('/Prototype/profile-carousel'))}
              >
                <img src={profile.photo} alt="" className="profile-rail-card__photo" />
                <div className="profile-rail-card__meta">
                  <p className="profile-rail-card__name">
                    {profile.name}{profile.age ? `, ${profile.age}` : ''}
                  </p>
                  <p className="profile-rail-card__detail">
                    {profile.role} · {profile.location}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        quickActions={(
          <QuickActionList
            actions={QUICK_ACTIONS}
            onAction={(action) => navigate(withPreviewQuery(action.route))}
          />
        )}
      />
    </PrototypeScreen>
  );
}