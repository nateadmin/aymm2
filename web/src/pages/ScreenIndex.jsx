import { Link } from 'react-router-dom';
import {
  PHASE_LABELS,
  SCREEN_CATALOG,
  STAGING_HUB,
  stagingUrl,
} from '@/lib/screenCatalog';

export default function ScreenIndex() {
  const phases = Object.keys(PHASE_LABELS).map(Number);

  return (
    <div className="screen-index">
      <header className="screen-index__header">
        <h1 className="screen-index__title">AYMM staging</h1>
        <p className="screen-index__lead">
          {SCREEN_CATALOG.length} built screens on staging. Login is skipped automatically on{' '}
          <strong>aymm.app</strong> so you can open every route below.
        </p>
        <p className="screen-index__meta">Share this page: {STAGING_HUB}</p>
      </header>

      {phases.map((phase) => (
        <section key={phase} className="screen-index__phase">
          <h2 className="screen-index__phase-title">{PHASE_LABELS[phase]}</h2>
          <ul className="screen-index__list">
            {SCREEN_CATALOG.filter((s) => s.phase === phase).map((screen) => (
              <li key={screen.id} className="screen-index__item">
                <span className="screen-index__num">{String(screen.id).padStart(2, '0')}</span>
                <div className="screen-index__body">
                  <a
                    href={stagingUrl(screen.route)}
                    className="screen-index__link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {screen.title}
                  </a>
                  <div className="screen-index__meta-row">
                    <Link to={screen.route} className="screen-index__ref-link">
                      Open in app
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
