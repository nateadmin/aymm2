import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { MESSAGE_REQUESTS } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function MessageRequests() {
  return (
    <CommunityScreen>
      <div className="screen-pad mobile-onboarding">
        <BackButton to={withPreviewQuery('/Community/letters-inbox')} />

        <div>
          <h1 className="auth-heading auth-heading--brand">Message Requests</h1>
          <p className="auth-subheading">
            These people want to connect. Accept to start a conversation.
          </p>
        </div>

        <div className="community-request-list">
          {MESSAGE_REQUESTS.map((request) => (
            <article key={request.id} className="community-request-card">
              <img src={request.photo} alt="" className="community-request-card__avatar" />
              <div className="community-request-card__body">
                <p className="community-request-card__name">{request.name}</p>
                <p className="community-request-card__meta">
                  {request.role} · {request.location}
                </p>
                <p className="community-request-card__message">{request.message}</p>
                <div className="community-request-card__actions">
                  <Button>Accept</Button>
                  <Button variant="outline">Decline</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CommunityScreen>
  );
}
