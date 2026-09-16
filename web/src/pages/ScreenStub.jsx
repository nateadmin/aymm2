import { Link, useParams } from 'react-router-dom';
import {
  frameImageUrl,
  getScreenBySlug,
  PHASE_LABELS,
  SCREEN_CATALOG,
  withPreviewQuery,
} from '@/lib/screenCatalog';

export default function ScreenStub() {
  const { slug } = useParams();
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return (
      <div className="design-ref">
        <p>Screen not found.</p>
        <Link to={withPreviewQuery('/screens')}>Back to all screens</Link>
      </div>
    );
  }

  const prev = SCREEN_CATALOG.find((item) => item.id === screen.id - 1);
  const next = SCREEN_CATALOG.find((item) => item.id === screen.id + 1);

  return (
    <div className="design-ref">
      <header className="design-ref__header">
        <Link to={withPreviewQuery('/screens')} className="design-ref__back">
          ← All screens
        </Link>
        <p className="design-ref__phase">{PHASE_LABELS[screen.phase]}</p>
        <h1 className="design-ref__title">
          {String(screen.id).padStart(2, '0')}. {screen.title}
        </h1>
        <p className="design-ref__status">Figma frame {String(screen.id).padStart(2, '0')} of 55</p>
      </header>

      <div className="design-ref__phone">
        <img
          src={frameImageUrl(screen)}
          alt={`${screen.title} design frame`}
          className="design-ref__image"
        />
      </div>

      <nav className="design-ref__nav">
        {prev ? (
          <Link to={withPreviewQuery(prev.route)}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={withPreviewQuery(next.route)}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
