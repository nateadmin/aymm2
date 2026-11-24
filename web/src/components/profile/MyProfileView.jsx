import { MoreHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';

/**
 * Frame #43 My Profile layout (shared by live /Profile and /Prototype/my-profile).
 */
export default function MyProfileView({
  displayName,
  age,
  identityMeta,
  photoUrl,
  bio,
  aboutTitle = 'About Me',
  answerRows = [],
  onOpenSettings,
  onEditProfile,
}) {
  const nameLine = [displayName, age != null && age !== '' ? age : null]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="prototype-my-profile">
      <div className="prototype-my-profile__hero">
        <img
          src={photoUrl || PLACEHOLDER_AVATAR}
          alt=""
          className="prototype-my-profile__hero-image"
        />
        {onOpenSettings ? (
          <button
            type="button"
            className="prototype-my-profile__menu"
            onClick={onOpenSettings}
            aria-label="Settings"
          >
            <MoreHorizontal size={18} />
          </button>
        ) : null}
      </div>

      <div className="prototype-my-profile__body">
        <div className="hero-profile-identity">
          <h1 className="hero-profile-identity__name">{nameLine}</h1>
          {identityMeta ? (
            <p className="hero-profile-identity__meta">{identityMeta}</p>
          ) : null}
        </div>

        {onEditProfile ? (
          <Button
            variant="outline"
            className="prototype-my-profile__edit"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        ) : null}

        {bio ? (
          <section className="prototype-my-profile__section">
            <h2 className="prototype-my-profile__section-title">{aboutTitle}</h2>
            <p className="prototype-my-profile__bio">{bio}</p>
          </section>
        ) : null}

        {answerRows.length > 0 ? (
          <section className="prototype-my-profile__section">
            <h2 className="prototype-my-profile__section-title">My Answers</h2>
            <dl className="prototype-my-profile__answers">
              {answerRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </div>
  );
}