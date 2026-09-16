import { Link, useParams } from 'react-router-dom';
import {
  frameImageUrl,
  getScreenBySlug,
  SCREEN_CATALOG,
  stagingUrl,
} from '@/lib/screenCatalog';

export default function DesignReference() {
  const { slug } = useParams();
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return (
      <div className="design-ref">
        <p>Screen not found.</p>
        <Link to="/screens">Back to screen index</Link>
      </div>
    );
  }

  const liveScreen = screen.status !== 'reference' ? screen : null;

  return (
    <div className="design-ref">
      <header className="design-ref__header">
        <Link to="/screens" className="design-ref__back">← All screens</Link>
        <h1 className="design-ref__title">
          {String(screen.id).padStart(2, '0')}. {screen.title}
        </h1>
        <p className="design-ref__status">
          Status: <strong>{screen.status}</strong>
          {liveScreen && (
            <>
              {' · '}
              <Link to={screen.route}>Open app route</Link>
              {' · '}
              <a href={stagingUrl(screen.route)} target="_blank" rel="noreferrer">Staging ↗</a>
            </>
          )}
        </p>
      </header>

      <div className="design-ref__phone">
        <img
          src={frameImageUrl(screen.frame)}
          alt={`Figma reference: ${screen.title}`}
          className="design-ref__image"
        />
      </div>

      <nav className="design-ref__nav">
        {screen.id > 1 && (
          <Link to={`/screens/ref/${SCREEN_CATALOG[screen.id - 2].slug}`}>← Previous</Link>
        )}
        {screen.id < SCREEN_CATALOG.length && (
          <Link to={`/screens/ref/${SCREEN_CATALOG[screen.id].slug}`}>Next →</Link>
        )}
      </nav>
    </div>
  );
}
