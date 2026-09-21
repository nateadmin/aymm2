import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken } from '@/api/client';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { tryMockUpload } from '@/lib/mockApi';
import { useToast } from '@/lib/toast';

export default function UploadPhotoStep() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { form, addPhoto, removePhoto, saveDraft, saving } = useProfileSetup();
  const { push } = useToast();
  const [uploading, setUploading] = useState(false);

  const photos = form.profile_photos || [];
  const primaryPhoto = photos[0] || '';
  const hasPhoto = Boolean(primaryPhoto);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      push('Please choose a JPG or PNG image.', 'error');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      push('Photo must be 10 MB or smaller.', 'error');
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const mock = await tryMockUpload(file, getStoredToken());
      const url = mock?.file_url || URL.createObjectURL(file);
      if (photos.length) {
        removePhoto(0);
      }
      addPhoto(url);
      push('Photo uploaded.', 'success');
    } catch {
      push('Photo upload failed. Try again.', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleContinue = async () => {
    if (!hasPhoto) return;
    const saved = await saveDraft('upload-photo');
    if (saved) {
      navigate('/ProfileSetup/upload-video');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/Register" />
          <MobileOnboardingProgress step={1} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Your profile photo</h1>
            <p className="auth-subheading">
              Add at least one clear face photo. This helps families find you.
            </p>
          </div>

          <label className="photo-upload-panel">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              className="photo-upload-panel__input"
              onChange={handleFile}
              disabled={uploading}
            />
            {hasPhoto ? (
              <div className="photo-upload-panel__preview">
                <img src={primaryPhoto} alt="Your profile photo" />
                <span className="photo-upload-panel__change">
                  {uploading ? 'Uploading…' : 'Tap to change photo'}
                </span>
              </div>
            ) : (
              <div className="photo-upload-panel__empty">
                <ImagePlus size={28} strokeWidth={1.75} aria-hidden="true" />
                <p className="photo-upload-panel__title">
                  {uploading ? 'Uploading…' : 'Tap to upload photo'}
                </p>
                <p className="photo-upload-panel__hint">JPG or PNG · Max 10 MB</p>
              </div>
            )}
          </label>
        </div>

        <Button
          variant={hasPhoto ? 'primary' : 'disabled'}
          disabled={!hasPhoto || saving || uploading}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </MobileScreen>
  );
}
