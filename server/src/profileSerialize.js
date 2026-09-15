import { rowToEntity } from './entities.js';

const JSON_FIELDS = new Set([
  'seeking_types',
  'profile_photos',
  'seeking_for',
  'seeking_sibling_reasons',
  'event_photos',
  'attendees',
]);

export function serializeProfile(row) {
  if (!row) return null;

  const entity = rowToEntity(row);
  for (const key of JSON_FIELDS) {
    if (entity[key] && typeof entity[key] === 'string') {
      entity[key] = JSON.parse(entity[key]);
    }
  }

  entity.setup_complete = Boolean(row.setup_complete);
  return entity;
}
