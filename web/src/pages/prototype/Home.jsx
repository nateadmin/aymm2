import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import HeartLogo from '@/components/brand/HeartLogo';
import { HOME_PROFILES, QUICK_ACTIONS } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function PrototypeHome() {
  const navigate = useNavigate();

  return (
    <PrototypeScreen>
      <div className="screen-pad prototype-home">
        <header className="prototype-home__header">
          <div>
            <h1 className="auth-heading auth-heading--brand prototype-home__greeting">Good morning</h1>
            <p className="auth-subheading prototype-home__subtitle">Find your family connection</p>
          </div>
          <HeartLogo className="prototype-home__logo" alt="" style={{ width: '0.55rem', height: '0.55rem' }} />
        </header>

        <section>
          <h2 className="home-section-title">Profiles near you</h2>
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
        </section>

        <section className="quick-actions">
          <h2 className="home-section-title">Quick actions</h2>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="quick-action-card"
              onClick={() => navigate(withPreviewQuery(action.route))}
            >
              <div>
                <p className="quick-action-card__title">{action.title}</p>
                <p className="quick-action-card__desc">{action.description}</p>
              </div>
              <ChevronRight className="quick-action-card__chevron" size={18} />
            </button>
          ))}
        </section>
      </div>
    </PrototypeScreen>
  );
}
