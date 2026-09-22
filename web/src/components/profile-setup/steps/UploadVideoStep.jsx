import { useRef, useState } from 'react';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken } from '@/api/client';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import MobileOnboardingProgress from '@/components/profile-setup/MobileOnboardingProgress';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';
import { tryMockUpload } from '@/lib/mockApi';
import { useToast } from '@/lib/toast';

export default function UploadVideoStep() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { form, updateField, saveDraft, saving } = useProfileSetup();
  const { push } = useToast();
  const [uploading, setUploading] = useState(false);
  const hasVideo = Boolean(form.intro_video_url);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const mock = await tryMockUpload(file, getStoredToken());
      const url = mock?.file_url || URL.createObjectURL(file);
      updateField('intro_video_url', url);
      push('Video uploaded.', 'success');
    } catch {
      push('Video upload failed. Try again.', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleContinue = async (skip = false) => {
    if (!skip && !hasVideo) return;
    const saved = await saveDraft('upload-video');
    if (saved) {
      navigate('/ProfileSetup/basic-info');
    }
  };

  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--handheld mobile-onboarding">
        <div className="mobile-onboarding__content">
          <BackButton to="/ProfileSetup/upload-photo" />
          <MobileOnboardingProgress step={2} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Introduce yourself</h1>
            <p className="auth-subheading">
              Record a short 10-second video so families can feel your warmth.
            </p>
          </div>

          <label className="video-upload">
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/*"
              className="video-upload__input"
              onChange={handleFile}
            />
            <div className={`video-upload__panel${hasVideo ? ' video-upload__panel--filled' : ''}`}>
              <Video size={28} strokeWidth={1.75} />
              <p className="video-upload__title">
                {uploading ? 'Uploading...' : hasVideo ? 'Video uploaded!' : 'Tap to record or upload'}
              </p>
              <p className="video-upload__hint">
                {hasVideo ? '10 sec · tap to re-record' : 'Max 10 seconds · MP4 or MOV'}
              </p>
            </div>
          </label>

          <div className="video-upload__notice">
            <span aria-hidden="true">💡</span>
            <p>All videos are reviewed by our safety team before being shown to families.</p>
          </div>
        </div>

        <div className="mobile-onboarding__actions">
          {hasVideo ? (
            <Button disabled={saving || uploading} onClick={() => handleContinue(false)}>
              Continue
            </Button>
          ) : null}
          <Button
            variant="outline"
            disabled={saving || uploading}
            onClick={() => handleContinue(true)}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </MobileScreen>
  );
}
