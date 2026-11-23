import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isRegisterFormComplete,
  registerFormFromTable,
  tablePatchFromRegisterForm,
} from './communityTableListing.js';

test('register form round-trips table listing fields', () => {
  const table = {
    hostUsername: '@martinez',
    address: '10 Main St',
    phone: '(555) 111-2222',
    about: 'Welcome',
    seatsLeft: 3,
    eventDateISO: '2025-12-25',
    eventDate: 'December 25, 2025',
    food: 'Tamales',
    dietaryCertification: 'halal',
    guestExpectations: 'Bring dessert',
  };
  const form = registerFormFromTable(table);
  assert.equal(form.username, '@martinez');
  assert.equal(form.details, 'Welcome');
  const patch = tablePatchFromRegisterForm(form);
  assert.equal(patch.hostUsername, '@martinez');
  assert.equal(patch.address, '10 Main St');
  assert.equal(patch.about, 'Welcome');
  assert.equal(patch.dietaryCertification, 'halal');
});

test('isRegisterFormComplete requires every register field', () => {
  const complete = {
    username: '@x',
    address: 'a',
    phone: 'p',
    details: 'd',
    seatsLeft: '2',
    eventDateISO: '2025-01-01',
    eventDate: 'January 1, 2025',
    food: 'f',
    guestExpectations: 'g',
  };
  assert.equal(isRegisterFormComplete(complete), true);
  assert.equal(isRegisterFormComplete({ ...complete, phone: '' }), false);
});