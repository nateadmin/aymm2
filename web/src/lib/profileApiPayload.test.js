import assert from 'node:assert/strict';
import test from 'node:test';
import { pickDeferredProfilePayload, profilePayloadForApi } from './profileApiPayload.js';

test('profilePayloadForApi omits deferred columns on draft saves', () => {
  const payload = {
    display_name: 'Charles',
    identity_type: 'father',
    intro_video_url: '/uploads/v.mp4',
    question_family_meaning: 'Love',
  };
  const draft = profilePayloadForApi(payload);
  assert.equal(draft.display_name, 'Charles');
  assert.equal('intro_video_url' in draft, false);
  assert.equal('question_family_meaning' in draft, false);
});

test('pickDeferredProfilePayload keeps only set deferred fields', () => {
  const picked = pickDeferredProfilePayload({
    display_name: 'Nate',
    intro_video_url: '/uploads/v.mp4',
    question_family_meaning: '',
    question_hoping_for: 'Hope',
  });
  assert.equal(picked.intro_video_url, '/uploads/v.mp4');
  assert.equal(picked.question_hoping_for, 'Hope');
  assert.equal('display_name' in picked, false);
  assert.equal('question_family_meaning' in picked, false);
});