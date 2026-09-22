import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import { PREVIOUS_PHOTOS } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function PreviousPhotos() {
  const gallery = PREVIOUS_PHOTOS;

  return (
    <CommunityScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad mobile-onboarding mobile-onboarding--scroll">
        <BackButton to={withPreviewQuery('/Community/family-table-details')} />

        <div>
          <h1 className="auth-heading auth-heading--brand">{gallery.title}</h1>
          <p className="auth-subheading">{gallery.subtitle}</p>
        </div>

        <img src={gallery.featured} alt="" className="community-gallery__featured" />

        <div className="community-gallery__grid">
          {gallery.photos.map((photo, index) => (
            <img key={index} src={photo} alt="" className="community-gallery__thumb" />
          ))}
        </div>
      </div>
    </CommunityScreen>
  );
}
