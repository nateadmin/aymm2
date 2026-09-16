import test from 'node:test';
import assert from 'node:assert/strict';
import { isDesignReviewHost } from './stagingPreview.js';

test('isDesignReviewHost matches staging and review environments', () => {
  assert.equal(isDesignReviewHost('aymm.app'), true);
  assert.equal(isDesignReviewHost('localhost'), true);
  assert.equal(isDesignReviewHost('aymm2-web--5173--abc123.local.webcontainer.io'), true);
  assert.equal(isDesignReviewHost('k03e2io1v3fx9wvj0vr8qd5q58o56n-fkdo--3111--d20a0a75.local-corp.webcontainer-api.io'), true);
  assert.equal(isDesignReviewHost('something.stackblitz.io'), true);
  assert.equal(isDesignReviewHost('my-codespace-123.github.dev'), true);
  assert.equal(isDesignReviewHost('example.com'), false);
});
