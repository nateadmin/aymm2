import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMyProfileAnswerRows,
  profileIdentityMeta,
  resolveProfileBio,
} from './profileDisplay.js';

test('profileIdentityMeta combines role and location', () => {
  assert.equal(
    profileIdentityMeta({ identity_type: 'daughter', city: 'Chicago', state: 'IL' }),
    'Daughter · Chicago, IL',
  );
});

test('resolveProfileBio picks first non-empty story', () => {
  assert.equal(resolveProfileBio({ bio: '' }, { bio: 'Hello world' }), 'Hello world');
  assert.equal(resolveProfileBio('Direct text'), 'Direct text');
});

test('buildMyProfileAnswerRows maps seeking faith and location', () => {
  const rows = buildMyProfileAnswerRows({
    seeking_types: ['mother'],
    religion: 'christianity',
    religion_private: false,
    city: 'Austin',
    state: 'TX',
  });
  assert.equal(rows[0].value, 'Mother');
  assert.equal(rows[1].value, 'Christianity');
  assert.equal(rows[2].value, 'Austin, TX');
});