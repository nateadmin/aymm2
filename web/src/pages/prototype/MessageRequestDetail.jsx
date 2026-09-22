import { useNavigate } from 'react-router-dom';
import PrototypeScreen from '@/components/prototype/PrototypeScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { MESSAGE_REQUEST_DETAIL } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function MessageRequestDetail() {
  const navigate = useNavigate();
  const request = MESSAGE_REQUEST_DETAIL;

  return (
    <PrototypeScreen showBottomNav={false}>
      <div className="screen-pad screen-pad--handheld mobile-onboarding prototype-message-request">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Community/message-requests')} />

          <div className="prototype-message-request__profile">
            <img src={request.photo} alt="" className="prototype-message-request__avatar" />
            <h1 className="auth-heading auth-heading--brand">{request.name}</h1>
            <p className="prototype-message-request__meta">
              {request.role} · {request.location}
            </p>
            <div className="prototype-message-request__tags">
              {request.tags.map((tag) => (
                <span key={tag} className="discovery-profile__tag discovery-profile__tag--identity">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prototype-message-request__preview">
            <p className="prototype-message-request__preview-label">Message preview</p>
            <p className="prototype-message-request__preview-text">&ldquo;{request.preview}&rdquo;</p>
          </div>

          <p className="prototype-message-request__note">
            Accepting this request will allow Linda to send you messages. You can block or remove
            the connection at any time.
          </p>
        </div>

        <div className="prototype-message-request__actions">
          <Button onClick={() => navigate(withPreviewQuery('/Community/open-conversation'))}>
            Accept Request
          </Button>
          <Button variant="outline" onClick={() => navigate(withPreviewQuery('/Community/message-requests'))}>
            Decline
          </Button>
        </div>
      </div>
    </PrototypeScreen>
  );
}
