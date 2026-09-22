import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import { EVENT_REMINDER } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function EventReminders() {
  const event = EVENT_REMINDER;

  return (
    <CommunityScreen showBottomNav={false}>
      <div className="screen-pad mobile-onboarding">
        <BackButton to={withPreviewQuery('/Community/family-table-details')} />

        <div className="community-event">
          <div className="community-event__calendar" aria-hidden="true">
            <span className="community-event__calendar-month">{event.month}</span>
            <span className="community-event__calendar-day">{event.day}</span>
          </div>

          <h1 className="auth-heading auth-heading--brand community-event__title">{event.title}</h1>
          <p className="auth-subheading community-event__subtitle">{event.subtitle}</p>

          <dl className="community-event__details">
            <div><dt>Event</dt><dd>{event.event}</dd></div>
            <div><dt>Host</dt><dd>{event.host}</dd></div>
            <div><dt>Date</dt><dd>{event.date}</dd></div>
            <div><dt>Time</dt><dd>{event.time}</dd></div>
            <div><dt>Location</dt><dd>{event.location}</dd></div>
            <div>
              <dt>Your seat</dt>
              <dd className="community-event__confirmed">{event.seatStatus} ✓</dd>
            </div>
          </dl>
        </div>
      </div>
    </CommunityScreen>
  );
}
