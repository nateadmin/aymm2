import { isCatalogFixtureReview } from './stagingPreview';
import { isFamilyProfile, shouldUseDesignReviewShell } from './session';

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
  if (!isFixtureReviewMode(session)) {
    if (kind === 'home' && isFamilyProfile(session?.profile)) return '/FamilyTables';
    return routes.live;
  }
  return routes.fixture;
}

export function resolveLettersRoute(session = {}) {
  return resolveAppRoute('letters', session);
}

function appendSearchParam(path, key, value) {
  if (path.includes(`${key}=`)) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}${key}=${encodeURIComponent(value)}`;
}

/** Live or fixture letters route with optional Messages tab (`requests` | `open` | `connections`). */
export function resolveMessagesPath(session = {}, { tab } = {}) {
  const base = resolveAppRoute('letters', session);
  if (!tab || !base.startsWith('/Messages')) return base;
  return appendSearchParam(base, 'tab', tab);
}