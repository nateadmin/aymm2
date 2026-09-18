import { Link, useParams } from 'react-router-dom';
import {
  frameImageUrl,
  getScreenBySlug,
  PHASE_LABELS,
  SCREEN_CATALOG,
  screenCardPath,
  withPreviewQuery,
} from '@/lib/screenCatalog';

export default function ScreenStub() {
  const { slug } = useParams();
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return (
      <div className="design-ref">
        <p>Screen not found.</p>
        <Link to={withPreviewQuery('/screens', { mobile: false })}>Back to all cards</Link>
      </div>
    );
  }

  const prev = SCREEN_CATALOG.find((item) => item.id === screen.id - 1);
  const next = SCREEN_CATALOG.find((item) => item.id === screen.id + 1);

  return (
    <div className="design-ref">
      <header className="design-ref__header">
        <Link to={withPreviewQuery('/screens', { mobile: false })} className="design-ref__back">
          ← All cards
        </Link>
        <p className="design-ref__phase">{PHASE_LABELS[screen.phase]}</p>
        <h1 className="design-ref__title">
          {String(screen.id).padStart(2, '0')}. {screen.title}
        </h1>
        <p className="design-ref__status">
          Card {String(screen.id).padStart(2, '0')} of {SCREEN_CATALOG.length}
        </p>
        <Link to={withPreviewQuery(screen.route)} className="design-ref__open">
          Open built screen
        </Link>
      </header>

      <div className="design-ref__phone">
        <img
          src={frameImageUrl(screen)}
          alt={`${screen.title} design card`}
          className="design-ref__image"
        />
      </div>

      <nav className="design-ref__nav">
        {prev ? (
          <Link to={withPreviewQuery(screenCardPath(prev), { mobile: false })}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={withPreviewQuery(screenCardPath(next), { mobile: false })}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
