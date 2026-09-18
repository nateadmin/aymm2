import { Link } from 'react-router-dom';
import {
  PHASE_LABELS,
  SCREEN_CATALOG,
  STATUS_LABELS,
  stagingUrl,
  withPreviewQuery,
} from '@/lib/screenCatalog';
import {
  disableStagingPreview,
  enableStagingPreview,
  isStagingPreviewEnabled,
} from '@/lib/stagingPreview';

export default function ScreenIndex() {
  const phases = Object.keys(PHASE_LABELS).map(Number);
  const previewOn = isStagingPreviewEnabled();
  const builtCount = SCREEN_CATALOG.filter((s) => s.status === 'live').length;
  const partialCount = SCREEN_CATALOG.filter((s) => s.status === 'partial').length;
  const frameCount = SCREEN_CATALOG.filter((s) => s.status === 'frame').length;

  return (
    <div className="screen-index">
      <header className="screen-index__header">
        <h1 className="screen-index__title">AYMM staging</h1>
        <p className="screen-index__lead">
          All {SCREEN_CATALOG.length} Figma screens ({builtCount} built, {partialCount} partial,{' '}
          {frameCount} design frames). Use <code>?mobile=1</code> for phone layout on desktop. Login
          bypass: <code>?preview=1</code>.
        </p>
        <p className="screen-index__meta">
          Interactive demo: <Link to={withPreviewQuery('/demo')}>Open /demo</Link>
          <br />
          Sample login: <strong>design@aymm.app</strong> / <strong>DesignReview1</strong>
          <br />
          Mobile hub: {stagingUrl('/screens')}
        </p>
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
                    <span className={`screen-index__badge screen-index__badge--${screen.status}`}>
                      {STATUS_LABELS[screen.status]}
                    </span>
                    <Link to={withPreviewQuery(screen.route)} className="screen-index__ref-link">
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
