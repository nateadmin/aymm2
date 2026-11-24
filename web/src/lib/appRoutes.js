import { isCatalogFixtureReview } from './stagingPreview';
import { shouldUseDesignReviewShell } from './session';

const APP_ROUTES = {
  home: { live: '/Home', fixture: '/Prototype/home' },
  profile: { live: '/Profile', fixture: '/Prototype/my-profile' },
  letters: { live: '/Messages', fixture: '/Community/letters-inbox' },
  tables: { live: '/FamilyTables', fixture: '/Community/family-table-listing' },
};

/** Fixture catalog / design shell vs live signed-in app. */
export function isFixtureReviewMode(session = {}) {
  return shouldUseDesignReviewShell(session) || isCatalogFixtureReview();
}

/** @param {'home'|'profile'|'letters'|'tables'} kind */
export function resolveAppRoute(kind, session = {}) {
  const routes = APP_ROUTES[kind];
  if (!routes) return '/Home';
  return isFixtureReviewMode(session) ? routes.fixture : routes.live;
}

export function resolveLettersRoute(session = {}) {
  return resolveAppRoute('letters', session);
}