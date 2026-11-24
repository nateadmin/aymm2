import assert from 'node:assert/strict';
import test from 'node:test';
import { getOnboardingResumeStep } from './onboarding.js';

test('getOnboardingResumeStep does not rewind after advancing past photo', () => {
  assert.equal(
    getOnboardingResumeStep('upload-photo', '/ProfileSetup/upload-video'),
    null,
  );
});

test('getOnboardingResumeStep resumes forward when saved step is ahead', () => {
  const step = getOnboardingResumeStep('basic-info', '/ProfileSetup/upload-video');
  assert.equal(step?.id, 'basic-info');
  assert.equal(step?.path, '/ProfileSetup/basic-info');
});