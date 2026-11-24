import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import MyProfileView from '@/components/profile/MyProfileView';
import { MY_PROFILE } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function MyProfile() {
  const navigate = useNavigate();
  const profile = MY_PROFILE;

  return (
    <PrototypeScreen bodyClassName="community-table-detail-screen">
      <MyProfileView
        displayName={profile.name}
        age={profile.age}
        identityMeta={`${profile.role} · ${profile.location}`}
        photoUrl={profile.photo}
        bio={profile.bio}
        answerRows={[
          { label: 'Seeking', value: profile.seeking },
          { label: 'Faith', value: profile.faith },
          { label: 'Location', value: profile.location },
        ]}
        onOpenSettings={() => navigate(withPreviewQuery('/Prototype/settings'))}
        onEditProfile={() => navigate(
          withPreviewQuery('/ProfileSetup/basic-info'),
          { state: { returnTo: withPreviewQuery('/Prototype/my-profile') } },
        )}
      />
    </PrototypeScreen>
  );
}