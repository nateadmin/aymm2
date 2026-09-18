import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProfileSetupProvider } from '@/components/profile-setup/ProfileSetupContext';
import UploadPhotoStep from '@/components/profile-setup/steps/UploadPhotoStep';
import UploadVideoStep from '@/components/profile-setup/steps/UploadVideoStep';
import BasicInfoStep from '@/components/profile-setup/steps/BasicInfoStep';
import IAmAStep from '@/components/profile-setup/steps/IAmAStep';
import SeekingAStep from '@/components/profile-setup/steps/SeekingAStep';
import ReligionStep from '@/components/profile-setup/steps/ReligionStep';
import QuestionsStep from '@/components/profile-setup/steps/QuestionsStep';
import ReviewStep from '@/components/profile-setup/steps/ReviewStep';
import CompleteStep from '@/components/profile-setup/steps/CompleteStep';

export default function ProfileSetup() {
  return (
    <ProfileSetupProvider>
      <Routes>
        <Route index element={<Navigate to="upload-photo" replace />} />
        <Route path="upload-photo" element={<UploadPhotoStep />} />
        <Route path="upload-video" element={<UploadVideoStep />} />
        <Route path="basic-info" element={<BasicInfoStep />} />
        <Route path="iam-a" element={<IAmAStep />} />
        <Route path="seeking-a" element={<SeekingAStep />} />
        <Route path="religion" element={<ReligionStep />} />
        <Route path="questions" element={<QuestionsStep />} />
        <Route path="bio" element={<Navigate to="/ProfileSetup/review" replace />} />
        <Route path="review" element={<ReviewStep />} />
        <Route path="complete" element={<CompleteStep />} />
      </Routes>
    </ProfileSetupProvider>
  );
}
