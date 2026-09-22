import { Link, useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import { LETTERS_INBOX, MESSAGE_REQUESTS } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function LettersInbox() {
  const navigate = useNavigate();

  return (
    <CommunityScreen>
      <div className="community-letters">
        <header className="community-letters__header">
          <h1 className="auth-heading auth-heading--brand">Letters</h1>
          <Link
            to={withPreviewQuery('/Community/message-requests')}
            className="community-letters__requests"
          >
            Requests ({MESSAGE_REQUESTS.length})
          </Link>
        </header>

        <div className="community-letter-list">
          {LETTERS_INBOX.map((letter) => (
            <button
              key={letter.id}
              type="button"
              className="community-letter-card"
              onClick={() => navigate(withPreviewQuery('/Community/open-conversation'))}
            >
              <img src={letter.photo} alt="" className="community-letter-card__avatar" />
              <div className="community-letter-card__body">
                <div className="community-letter-card__top">
                  <p className="community-letter-card__name">{letter.name}</p>
                  <span className="community-letter-card__time">{letter.time}</span>
                </div>
                <p className="community-letter-card__meta">
                  {letter.role} · {letter.location}
                </p>
                <p className="community-letter-card__preview">{letter.preview}</p>
              </div>
              {letter.unread ? <span className="community-letter-card__dot" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      </div>
    </CommunityScreen>
  );
}
