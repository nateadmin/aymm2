import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { getPrimaryActionLabel } from '@/lib/connections';
import { distanceMiles } from '@/lib/matching';
import PrimaryActionLabel from '@/components/brand/PrimaryActionLabel';
import Button from '@/components/ui/Button';

export default function ProfileCard({
  profile,
  viewerProfile,
  pendingOutgoing,
  onPrimaryAction,
  onMessage,
  onChallenge,
  onRecommend,
  onReligion,
  onOpen,
}) {
  if (!profile) return null;

  const photo = profile.profile_photos?.[0] || PLACEHOLDER_AVATAR;
  const distance =
    viewerProfile?.real_life_visits
    && viewerProfile.lat != null
    && viewerProfile.lon != null
    && profile.lat != null
    && profile.lon != null
      ? distanceMiles(viewerProfile.lat, viewerProfile.lon, profile.lat, profile.lon)
      : null;

  const primaryLabel = pendingOutgoing ? 'Sent!' : getPrimaryActionLabel(viewerProfile, profile);

  return (
    <article className="profile-card aymm-panel" data-demo={profile.is_demo ? 'true' : 'false'}>
      <button type="button" className="profile-card__open" onClick={() => onOpen?.(profile)}>
        <img src={photo} alt="" className="profile-card__photo" />
        <div>
          <h3 className="aymm-heading aymm-heading--card">{profile.display_name}</h3>
          <p className="aymm-muted">{profile.identity_type}</p>
          {distance != null ? <p className="aymm-muted">📍 {distance.toFixed(1)} mi away</p> : null}
        </div>
      </button>

      <div className="profile-card__actions">
        <Button onClick={() => onPrimaryAction?.(profile)} disabled={profile.is_demo}>
          <PrimaryActionLabel label={primaryLabel} />
        </Button>
        <div className="page-shell__grid page-shell__grid--actions">
          <button type="button" className="aymm-pill-action" onClick={() => onMessage?.(profile)}>Msg</button>
          <button type="button" className="aymm-pill-action" onClick={() => onChallenge?.(profile)}>Challenge</button>
          <button type="button" className="aymm-pill-action" onClick={() => onRecommend?.(profile)}>Recommend</button>
          <button type="button" className="aymm-pill-action" onClick={() => onReligion?.(profile)}>Religion</button>
        </div>
      </div>
    </article>
  );
}
