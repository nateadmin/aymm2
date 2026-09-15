import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPostAuthPath,
  hasCompletedProfile,
  isOnboardingEntryPath,
  isProfileEditPath,
  mergeProfileState,
} from './session.js';
import { buildProfilePayload } from './onboardingPayload.js';

test('hasCompletedProfile respects setup_complete flag', () => {
  assert.equal(hasCompletedProfile({ setup_complete: true }), true);
  assert.equal(hasCompletedProfile({ setup_complete: false }), false);
  assert.equal(hasCompletedProfile(null), false);
});

test('getPostAuthPath routes completed users to Home', () => {
  assert.equal(getPostAuthPath({ hasProfile: true }), '/Home');
  assert.equal(getPostAuthPath({ profile: { setup_complete: true } }), '/Home');
  assert.equal(getPostAuthPath({ hasProfile: false }), '/ProfileSetup/upload-photo');
});

test('onboarding entry vs edit paths are distinct', () => {
  assert.equal(isOnboardingEntryPath('/ProfileSetup/upload-photo'), true);
  assert.equal(isProfileEditPath('/ProfileSetup/basic-info'), true);
  assert.equal(isProfileEditPath('/ProfileSetup/upload-photo'), false);
});

test('mergeProfileState preserves setup_complete on draft saves', () => {
  const merged = mergeProfileState(
    { display_name: 'Nate', setup_complete: true },
    { display_name: 'Nate', profile_photos: ['/uploads/a.png'] },
  );
  assert.equal(merged.setup_complete, true);
});

test('buildProfilePayload only sends setup_complete when requested', () => {
  const form = {
    display_name: 'Nate',
    identity_type: 'son',
    seeking_types: ['father'],
    profile_photos: [],
    religion_private: false,
    seeking_for: [],
    seeking_sibling_reasons: [],
    bio: 'hello world',
  };

  const draft = buildProfilePayload(form);
  const finalPayload = buildProfilePayload(form, {
    setupComplete: true,
    includeSetupComplete: true,
  });

  assert.equal('setup_complete' in draft, false);
  assert.equal(finalPayload.setup_complete, true);
});
