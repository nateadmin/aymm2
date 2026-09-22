import Modal from '@/components/ui/Modal';
import PrimaryActionLabel from '@/components/brand/PrimaryActionLabel';
import Button from '@/components/ui/Button';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { getPrimaryActionLabel } from '@/lib/connections';

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

  return (
    <Modal open={open} title={profile.display_name} onClose={onClose}>
      <div className="profile-detail">
        <img src={photo} alt="" className="profile-detail__photo" />
        <p className="aymm-muted">{profile.identity_type} · {profile.location || 'Location TBD'}</p>
        <div className="aymm-panel aymm-panel--surface">{profile.bio || 'Bio coming soon.'}</div>
        <Button onClick={() => onPrimaryAction?.(profile)} disabled={profile.is_demo}>
          <PrimaryActionLabel label={primaryLabel} />
        </Button>
        <div className="page-shell__grid page-shell__grid--actions">
          <button type="button" className="aymm-pill-action" onClick={() => onMessage?.(profile)}>Message</button>
          <button type="button" className="aymm-pill-action" onClick={() => onChallenge?.(profile)}>Challenge</button>
          <button type="button" className="aymm-pill-action" onClick={() => onRecommend?.(profile)}>Recommend</button>
          <button type="button" className="aymm-pill-action" onClick={() => onReligion?.(profile)}>Religion</button>
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

  return (
    <div className="page-shell__grid">
      {filled.map(([key, label]) => (
        <div key={key} className="aymm-panel">
          <strong>{label}</strong>
          <p className="aymm-muted">{Array.isArray(profile[key]) ? profile[key].join(', ') : profile[key]}</p>
        </div>
      ))}
    </div>
  );
}
