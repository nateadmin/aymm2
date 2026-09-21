import {
  BookOpen,
  Camera,
  Check,
  Search,
  User,
  Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { emojiForIdentity, labelForIdentity, labelForReligion } from '@/lib/constants';

function ReviewCard({ icon, title, value, editPath, onEdit }) {
  return (
    <div className="review-card">
      <div className="review-card__icon" aria-hidden="true">{icon}</div>
      <div className="review-card__body">
        <p className="review-card__title">{title}</p>
        <p className="review-card__value">{value}</p>
      </div>
      <div className="review-card__aside">
        <button type="button" className="review-card__edit" onClick={() => onEdit(editPath)}>
          Edit
        </button>
        <div className="review-card__check" aria-hidden="true">
          <Check size={16} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

export default function ReviewStep() {
  const navigate = useNavigate();
  const { form, completeOnboarding, saving } = useProfileSetup();

  const photoCount = form.profile_photos.length;
  const photoLabel = photoCount === 1 ? '1 photo uploaded' : `${photoCount} photos uploaded`;
  const basicInfo = [form.display_name, form.age].filter(Boolean).join(', ');
  const basicInfoLine = basicInfo && form.location
    ? `${basicInfo} · ${form.location}`
    : basicInfo || form.location || 'Not added yet';
  const identityEmoji = emojiForIdentity(form.identity_type);

  const cards = [
    {
      icon: <Camera size={20} />,
      title: 'Photos',
      value: photoCount ? photoLabel : 'No photos yet',
      editPath: '/ProfileSetup/upload-photo',
    },
    {
      icon: <Video size={20} />,
      title: 'Introduction Video',
      value: form.intro_video_url ? '10-sec video ready' : 'Skipped',
      editPath: '/ProfileSetup/upload-video',
    },
    {
      icon: <User size={20} />,
      title: 'Basic Info',
      value: basicInfoLine,
      editPath: '/ProfileSetup/basic-info',
    },
    {
      icon: identityEmoji
        ? <span className="review-card__emoji">{identityEmoji}</span>
        : <span className="review-card__emoji">💛</span>,
      title: 'Identity',
      value: labelForIdentity(form.identity_type) || 'Not selected',
      editPath: '/ProfileSetup/iam-a',
    },
    {
      icon: <Search size={20} />,
      title: 'Seeking',
      value: form.seeking_types.length
        ? form.seeking_types.map(labelForIdentity).join(', ')
        : 'Not selected',
      editPath: '/ProfileSetup/seeking-a',
    },
    {
      icon: <BookOpen size={20} className="review-card__faith-icon" />,
      title: 'Faith',
      value: labelForReligion(form.religion) || 'No preference',
      editPath: '/ProfileSetup/religion',
    },
  ];

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/questions" />
          <MobileOnboardingProgress step={8} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Review your profile</h1>
            <p className="auth-subheading">Give it one last look before going live.</p>
          </div>

          <div className="review-card-list">
            {cards.map((card) => (
              <ReviewCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                editPath={card.editPath}
                onEdit={navigate}
              />
            ))}
          </div>
        </div>

        <Button disabled={saving} onClick={completeOnboarding}>
          {saving ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </div>
    </MobileScreen>
  );
}
