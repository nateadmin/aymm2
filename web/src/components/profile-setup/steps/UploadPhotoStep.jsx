import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import PhotoUpload from '@/components/profile-setup/PhotoUpload';
import { useProfileSetup } from '@/components/profile-setup/ProfileSetupContext';

export default function UploadPhotoStep() {
  const navigate = useNavigate();
  const { form, addPhoto, removePhoto, saveDraft, saving } = useProfileSetup();

  const handleContinue = async () => {
    const saved = await saveDraft('upload-photo');
    if (saved) {
      navigate('/ProfileSetup/upload-video');
    }
  };

  return (
    <div className="page-shell__grid">
      <PhotoUpload
        photos={form.profile_photos}
        onAdd={addPhoto}
        onRemove={removePhoto}
      />
      <div className="public-page__actions">
        <Button
          disabled={!form.profile_photos.length || saving}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
