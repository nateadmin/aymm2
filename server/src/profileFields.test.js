import assert from 'node:assert/strict';
import test from 'node:test';
import { pickWritableProfileFields } from './profileFields.js';

test('pickWritableProfileFields keeps known onboarding columns', () => {
  const picked = pickWritableProfileFields({
    display_name: 'Charles',
    identity_type: 'father',
    intro_video_url: 'https://example.com/v.mp4',
    question_family_meaning: 'Love',
    not_a_column: 'drop me',
    id: 'ignore',
  });

  assert.equal(picked.display_name, 'Charles');
  assert.equal(picked.identity_type, 'father');
  assert.equal(picked.intro_video_url, 'https://example.com/v.mp4');
  assert.equal(picked.question_family_meaning, 'Love');
  assert.equal('not_a_column' in picked, false);
  assert.equal('id' in picked, false);
});