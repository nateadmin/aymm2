import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import PrimaryActionLabel from '@/components/brand/PrimaryActionLabel';
import { CAROUSEL_PROFILE } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function ProfileCarousel() {
  const navigate = useNavigate();
  const profile = CAROUSEL_PROFILE;
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <PrototypeScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad mobile-onboarding mobile-onboarding--scroll prototype-carousel">
        <BackButton to={withPreviewQuery('/Prototype/home')} />

        <p className="prototype-carousel__hint">Simply Scroll &gt;&gt;&gt;&gt;&gt;</p>
        <h1 className="prototype-carousel__category">{profile.category}</h1>

        <div className="prototype-carousel__photos">
          <button
            type="button"
            className="prototype-carousel__photo-nav prototype-carousel__photo-nav--prev"
            onClick={() => setPhotoIndex((index) => Math.max(0, index - 1))}
            aria-label="Previous photo"
          />
          <img
            src={profile.photos[photoIndex]}
            alt=""
            className="prototype-carousel__photo"
          />
          <button
            type="button"
            className="prototype-carousel__photo-nav prototype-carousel__photo-nav--next"
            onClick={() => setPhotoIndex((index) => Math.min(profile.photos.length - 1, index + 1))}
            aria-label="Next photo"
          />
        </div>

        <div className="prototype-carousel__dots" aria-hidden="true">
          {profile.photos.map((_, index) => (
            <span
              key={index}
              className={`prototype-carousel__dot${index === photoIndex ? ' prototype-carousel__dot--active' : ''}`}
            />
          ))}
        </div>

        <h2 className="prototype-carousel__name">{profile.name}</h2>
        <p className="prototype-carousel__headline">{profile.headline}</p>

        <Button onClick={() => navigate(withPreviewQuery('/Prototype/adoption-approved'))}>
          <PrimaryActionLabel label="Adopt" />
        </Button>

        <div className="discovery-profile__action-grid">
          <button type="button" className="discovery-profile__action">
            <span>Msg</span>
          </button>
          <button
            type="button"
            className="discovery-profile__action"
            onClick={() => navigate(withPreviewQuery('/Prototype/compatibility-challenge'))}
          >
            <span>Challenge</span>
          </button>
          <button type="button" className="discovery-profile__action">
            <span>Recommend</span>
          </button>
          <button
            type="button"
            className="discovery-profile__action"
            onClick={() => navigate(withPreviewQuery('/Prototype/religion-selector'))}
          >
            <span>Religion</span>
          </button>
        </div>

        <section className="prototype-carousel__about">
          <h3 className="discovery-profile__section-title">About Me</h3>
          <p className="discovery-profile__bio">{profile.bio}</p>
        </section>
      </div>
    </PrototypeScreen>
  );
}
