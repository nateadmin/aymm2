import { ChevronRight } from 'lucide-react';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import { MY_PROFILE, SETTINGS_SECTIONS } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function Settings() {
  const profile = MY_PROFILE;

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad mobile-onboarding mobile-onboarding--scroll prototype-settings">
        <BackButton to={withPreviewQuery('/Prototype/my-profile')} />

        <h1 className="auth-heading auth-heading--brand prototype-settings__title">Settings</h1>

        <div className="prototype-settings__profile-card">
          <img src={profile.photo} alt="" className="prototype-settings__avatar" />
          <div>
            <p className="prototype-settings__name">{profile.fullName}</p>
            <p className="prototype-settings__meta">
              {profile.role} · {profile.location}
            </p>
          </div>
        </div>

        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.title} className="prototype-settings__section">
            <h2 className="prototype-settings__section-title">{section.title}</h2>
            <div className="prototype-settings__list">
              {section.items.map((item) => (
                <button key={item} type="button" className="prototype-settings__row">
                  <span>{item}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PrototypeScreen>
  );
}
