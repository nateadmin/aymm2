import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import Button from '@/components/ui/Button';
import { MY_PROFILE } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function MyProfile() {
  const navigate = useNavigate();
  const profile = MY_PROFILE;

  return (
    <PrototypeScreen bodyClassName="community-table-detail-screen">
      <div className="prototype-my-profile">
        <div className="prototype-my-profile__hero">
          <img src={profile.photo} alt="" className="prototype-my-profile__hero-image" />
          <button
            type="button"
            className="prototype-my-profile__menu"
            onClick={() => navigate(withPreviewQuery('/Prototype/settings'))}
            aria-label="Settings"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="prototype-my-profile__body">
          <h1 className="prototype-my-profile__name">
            {profile.name}, {profile.age}
          </h1>
          <p className="prototype-my-profile__meta">
            {profile.role} · {profile.location}
          </p>

          <Button
            variant="outline"
            className="prototype-my-profile__edit"
            onClick={() => navigate(withPreviewQuery('/ProfileSetup/basic-info'))}
          >
            Edit Profile
          </Button>

          <section className="prototype-my-profile__section">
            <h2 className="prototype-my-profile__section-title">About Me</h2>
            <p className="prototype-my-profile__bio">{profile.bio}</p>
          </section>

          <section className="prototype-my-profile__section">
            <h2 className="prototype-my-profile__section-title">My Answers</h2>
            <dl className="prototype-my-profile__answers">
              <div><dt>Seeking</dt><dd>{profile.seeking}</dd></div>
              <div><dt>Faith</dt><dd>{profile.faith}</dd></div>
              <div><dt>Location</dt><dd>{profile.location}</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </PrototypeScreen>
  );
}
