import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DEMO_LINKS,
  PHASE_LABELS,
  SCREEN_CATALOG,
  STATUS_LABELS,
  screenCardPath,
  screenThumbnailUrl,
  withPreviewQuery,
} from '@/lib/screenCatalog';
import {
  disableStagingPreview,
  enableStagingPreview,
  isStagingPreviewEnabled,
} from '@/lib/stagingPreview';

export default function ScreenIndex() {
  const [phaseFilter, setPhaseFilter] = useState(0);
  const previewOn = isStagingPreviewEnabled();
  const builtCount = SCREEN_CATALOG.filter((s) => s.status === 'live').length;
  const phases = Object.keys(PHASE_LABELS).map(Number);

  const visiblePhases = useMemo(
    () => (phaseFilter === 0 ? phases : phases.filter((phase) => phase === phaseFilter)),
    [phaseFilter, phases],
  );

  return (
    <div className="screen-index">
      <header className="screen-index__header">
        <h1 className="screen-index__title">AYMM demo</h1>
        <nav className="screen-index__short-links" aria-label="Demo entry points">
          <Link to={DEMO_LINKS.app}>aymm demo</Link>
          <span aria-hidden="true">·</span>
          <Link to={DEMO_LINKS.catalog}>aymm catalog</Link>
          <span aria-hidden="true">·</span>
          <Link to={DEMO_LINKS.login}>login</Link>
        </nav>
        <p className="screen-index__lead">
          {SCREEN_CATALOG.length} screens ({builtCount} built). Thumbnails show the live phone mock
          — tap a card or open the built screen.
        </p>
        <p className="screen-index__meta">
          Sample login: <strong>design@aymm.app</strong> / <strong>DesignReview1</strong>
        </p>
        <div className="screen-index__filters" role="tablist" aria-label="Filter screens by phase">
          <button
            type="button"
            className={`screen-index__filter${phaseFilter === 0 ? ' is-active' : ''}`}
            onClick={() => setPhaseFilter(0)}
          >
            All {SCREEN_CATALOG.length}
          </button>
          {phases.map((phase) => (
            <button
              key={phase}
              type="button"
              className={`screen-index__filter${phaseFilter === phase ? ' is-active' : ''}`}
              onClick={() => setPhaseFilter(phase)}
            >
              Phase {phase}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="screen-index__preview-toggle"
          onClick={() => {
            if (previewOn) {
              disableStagingPreview();
            } else {
              enableStagingPreview();
            }
            window.location.reload();
          }}
        >
          {previewOn ? 'Turn off login bypass' : 'Turn on login bypass'}
        </button>
      </header>

      {visiblePhases.map((phase) => (
        <section key={phase} className="screen-index__phase">
          <h2 className="screen-index__phase-title">{PHASE_LABELS[phase]}</h2>
          <ul className="screen-index__grid">
            {SCREEN_CATALOG.filter((s) => s.phase === phase).map((screen) => (
              <li key={screen.id} className="screen-card">
                <Link
                  to={withPreviewQuery(screen.route, { native: false })}
                  className="screen-card__thumb"
                >
                  <img
                    src={screenThumbnailUrl(screen)}
                    alt={`${screen.title} live preview`}
                    loading="lazy"
                  />
                </Link>
                <div className="screen-card__body">
                  <div className="screen-card__meta">
                    <span className="screen-index__num">{String(screen.id).padStart(2, '0')}</span>
                    <span className={`screen-index__badge screen-index__badge--${screen.status}`}>
                      {STATUS_LABELS[screen.status]}
                    </span>
                  </div>
                  <h3 className="screen-card__title">{screen.title}</h3>
                  <div className="screen-card__actions">
                    <Link
                      to={withPreviewQuery(screenCardPath(screen), { mobile: false })}
                      className="screen-card__action"
                    >
                      View this card
                    </Link>
                    <Link
                      to={withPreviewQuery(screen.route, { native: false })}
                      className="screen-card__action screen-card__action--primary"
                    >
                      open screen
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
