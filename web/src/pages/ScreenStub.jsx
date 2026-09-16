import { Link, useParams } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import { getScreenBySlug, PHASE_LABELS, STAGING_HUB, withPreviewQuery } from '@/lib/screenCatalog';

export default function ScreenStub() {
  const { slug } = useParams();
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return (
      <MobileScreen>
        <div className="screen-pad screen-pad--center">
          <h1 className="screen-stub__title">Screen not found</h1>
          <Link to={withPreviewQuery('/screens')}>Back to staging hub</Link>
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen>
      <div className="screen-pad screen-stub">
        <p className="screen-stub__phase">{PHASE_LABELS[screen.phase]}</p>
        <h1 className="screen-stub__title">{screen.title}</h1>
        <p className="screen-stub__copy">
          Screen {String(screen.id).padStart(2, '0')} of 55 — UI not built yet. This placeholder
          keeps the staging map complete while we implement the real flow.
        </p>
        <div className="screen-stub__actions">
          <Link to={withPreviewQuery('/screens')} className="aymm-button aymm-button--primary">
            All screens
          </Link>
          <a className="screen-stub__ext" href={STAGING_HUB}>
            Share hub link
          </a>
        </div>
      </div>
    </MobileScreen>
  );
}
