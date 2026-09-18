import { Info, MessageCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import PrimaryActionLabel from '@/components/brand/PrimaryActionLabel';
import Button from '@/components/ui/Button';
import { labelForIdentity, labelForReligion } from '@/lib/constants';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function DiscoveryProfileScreen({ profile, backTo = '/screens' }) {
  const navigate = useNavigate();
  const photo = profile.profile_photos?.[0];
  const identityLabel = labelForIdentity(profile.identity_type);
  const religionLabel = labelForReligion(profile.religion);

  const handlePrimary = () => {
    navigate(withPreviewQuery('/Discovery/connection-success'));
  };

  return (
    <MobileScreen bodyClassName="discovery-profile-scroll">
      <div className="discovery-profile">
        <div className="discovery-profile__toolbar">
          <BackButton to={backTo} />
        </div>

        {photo ? (
          <div className="discovery-profile__hero">
            <img src={photo} alt="" className="discovery-profile__hero-image" />
          </div>
        ) : null}

        <div className="discovery-profile__body">
          <div className="discovery-profile__header">
            <h1 className="discovery-profile__name">
              {profile.display_name}{profile.age ? `, ${profile.age}` : ''}
            </h1>
            <p className="discovery-profile__headline">
              {profile.seeking_headline} · {profile.location}
            </p>
            <div className="discovery-profile__tags">
              <span className="discovery-profile__tag discovery-profile__tag--identity">
                {identityLabel}
              </span>
              {religionLabel ? (
                <span className="discovery-profile__tag">{religionLabel}</span>
              ) : null}
            </div>
          </div>

          <Button variant={profile.primaryVariant || 'primary'} onClick={handlePrimary}>
            <PrimaryActionLabel label={profile.primaryLabel} />
          </Button>

          <div className="discovery-profile__action-grid">
            <button
              type="button"
              className="discovery-profile__action"
              onClick={() => navigate(withPreviewQuery('/Messages'))}
            >
              <MessageCircle size={22} strokeWidth={1.75} />
              <span>Message</span>
            </button>
            <button type="button" className="discovery-profile__action">
              <Info size={22} strokeWidth={1.75} />
              <span>Challenge</span>
            </button>
            <button
              type="button"
              className="discovery-profile__action"
              onClick={() => navigate(withPreviewQuery('/Discovery/recommend'))}
            >
              <Star size={22} strokeWidth={1.75} />
              <span>Recommend</span>
            </button>
          </div>

          <section className="discovery-profile__section">
            <h2 className="discovery-profile__section-title">{profile.aboutTitle || 'About Me'}</h2>
            <p className="discovery-profile__bio">{profile.bio}</p>
          </section>

          {profile.family_members?.length ? (
            <section className="discovery-profile__section">
              <div className="discovery-profile__members">
                {profile.family_members.map((member) => (
                  <div key={member.role} className="discovery-profile__member">
                    <span>{member.role}</span>
                    <span>{member.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </MobileScreen>
  );
}
