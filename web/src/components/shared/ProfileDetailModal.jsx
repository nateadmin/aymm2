import Modal from '@/components/ui/Modal';
import PrimaryActionLabel from '@/components/brand/PrimaryActionLabel';
import Button from '@/components/ui/Button';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { getPrimaryActionLabel } from '@/lib/connections';
import { formatLabel } from '@/lib/format';

export default function ProfileDetailModal({
  profile,
  open,
  onClose,
  viewerProfile,
  pendingOutgoing,
  onPrimaryAction,
  onMessage,
  onChallenge,
  onRecommend,
  onReligion,
}) {
  if (!profile) return null;

  const photo = profile.profile_photos?.[0] || PLACEHOLDER_AVATAR;
  const primaryLabel = pendingOutgoing ? 'Sent!' : getPrimaryActionLabel(viewerProfile, profile);
  const role = formatLabel(profile.identity_type) || 'Member';
  const location = profile.location
    || [profile.city, profile.state].filter(Boolean).join(', ')
    || 'Location TBD';

  return (
    <Modal open={open} title={profile.display_name} onClose={onClose} bodyClassName="profile-detail">
      <div className="profile-detail">
        <div className="profile-detail__hero">
          <img src={photo} alt="" className="profile-detail__photo" />
        </div>
        <p className="profile-detail__meta aymm-muted">
          {role} · {location}
        </p>
        <section className="profile-detail__section">
          <h3 className="profile-detail__section-title">About</h3>
          <p className="profile-detail__bio">{profile.bio || 'Bio coming soon.'}</p>
        </section>
        <div className="profile-detail__primary">
          <Button
            className="profile-detail__connect"
            onClick={() => onPrimaryAction?.(profile)}
            disabled={profile.is_demo}
          >
            <PrimaryActionLabel label={primaryLabel} />
          </Button>
        </div>
        <div className="profile-detail__action-grid" role="group" aria-label="Profile actions">
          <button type="button" className="profile-detail__action" onClick={() => onMessage?.(profile)}>
            Message
          </button>
          <button type="button" className="profile-detail__action" onClick={() => onChallenge?.(profile)}>
            Challenge
          </button>
          <button type="button" className="profile-detail__action" onClick={() => onRecommend?.(profile)}>
            Recommend
          </button>
          <button type="button" className="profile-detail__action" onClick={() => onReligion?.(profile)}>
            Religion
          </button>
        </div>
        <PlaceholderDetails profile={profile} />
      </div>
    </Modal>
  );
}

function PlaceholderDetails({ profile }) {
  const fields = [
    ['seeking_for', 'Seeking for'],
    ['favorite_foods', 'Favorite foods'],
    ['hobbies', 'Hobbies'],
    ['last_book', 'Last book'],
    ['last_movie', 'Last movie'],
    ['family_name', 'Family name'],
  ];

  const filled = fields.filter(([key]) => profile[key]);

  if (!filled.length) return null;

  return (
    <section className="profile-detail__section profile-detail__section--fields">
      <h3 className="profile-detail__section-title">Details</h3>
      <div className="profile-detail__fields">
        {filled.map(([key, label]) => (
          <div key={key} className="profile-detail__field">
            <strong className="profile-detail__field-label">{label}</strong>
            <p className="profile-detail__field-value aymm-muted">
              {Array.isArray(profile[key]) ? profile[key].join(', ') : profile[key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
