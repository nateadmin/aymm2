import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PHASE_LABELS,
  SCREEN_CATALOG,
  stagingUrl,
} from '@/lib/screenCatalog';
import {
  disableStagingPreview,
  enableStagingPreview,
  isStagingPreviewEnabled,
} from '@/lib/stagingPreview';

function StatusBadge({ status }) {
  const labels = {
    live: 'Live',
    partial: 'Partial',
    reference: 'Figma ref',
  };
  return <span className={`screen-index__badge screen-index__badge--${status}`}>{labels[status] || status}</span>;
}

export default function ScreenIndex() {
  const phases = [1, 2, 3, 4];
  const [previewOn, setPreviewOn] = useState(isStagingPreviewEnabled());

  function togglePreview() {
    if (previewOn) {
      disableStagingPreview();
      setPreviewOn(false);
    } else {
      enableStagingPreview();
      setPreviewOn(true);
    }
  }

  return (
    <div className="screen-index">
      <header className="screen-index__header">
        <h1 className="screen-index__title">AYMM staging screens</h1>
        <p className="screen-index__lead">
          {SCREEN_CATALOG.length} wireframe-faithful screens.{' '}
          <strong>Live</strong> and <strong>Partial</strong> open the app route;{' '}
          <strong>Figma ref</strong> shows the design PNG until the screen is built.
        </p>
        <p className="screen-index__meta">Staging base: {stagingUrl('/')}</p>
        <button type="button" className="screen-index__preview-toggle" onClick={togglePreview}>
          {previewOn ? 'Disable staging preview (login required)' : 'Enable staging preview (skip login)'}
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
                  <Link to={screen.route} className="screen-index__link">
                    {screen.title}
                  </Link>
                  <div className="screen-index__meta-row">
                    <StatusBadge status={screen.status} />
                    <Link to={`/screens/ref/${screen.slug}`} className="screen-index__ref-link">
                      View Figma ref
                    </Link>
                    <a
                      href={stagingUrl(screen.route)}
                      className="screen-index__ext"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open staging ↗
                    </a>
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
