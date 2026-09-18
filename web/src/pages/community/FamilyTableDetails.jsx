import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { JOHNSON_TABLE } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function FamilyTableDetails() {
  const navigate = useNavigate();
  const table = JOHNSON_TABLE;

  return (
    <CommunityScreen showBottomNav={false} bodyClassName="community-table-detail-screen">
      <div className="community-table-detail">
        <div className="community-table-detail__toolbar">
          <BackButton to={withPreviewQuery('/Community/family-table-listing')} />
        </div>

        <div className="community-table-detail__hero">
          <img src={table.photo} alt="" className="community-table-detail__hero-image" />
        </div>

        <div className="community-table-detail__body">
          <h1 className="community-table-detail__title">{table.name}</h1>
          <p className="community-table-detail__headline">{table.headline}</p>

          <div className="community-table-detail__stats">
            <div className="community-table-detail__stat">
              <strong>{table.seatsLeft} left</strong>
              <span>Seats</span>
            </div>
            <div className="community-table-detail__stat">
              <strong>{table.bedsAvailable} avail.</strong>
              <span>Beds</span>
            </div>
            <div className="community-table-detail__stat">
              <strong>{table.faith}</strong>
              <span>Faith</span>
            </div>
          </div>

          <dl className="community-table-detail__facts">
            <div><dt>Holiday</dt><dd>{table.holiday}</dd></div>
            <div><dt>Food</dt><dd>{table.food}</dd></div>
            <div><dt>Religion</dt><dd>{table.religion}</dd></div>
          </dl>

          <button
            type="button"
            className="community-table-detail__link"
            onClick={() => navigate(withPreviewQuery('/Community/previous-photos'))}
          >
            See previous table photos →
          </button>

          <section id="about-event" className="community-table-detail__about">
            <h2 className="community-table-detail__about-title">About This Event</h2>
            <p className="community-table-detail__about-copy">{table.about}</p>
            <dl className="community-table-detail__about-facts">
              <div><dt>Host Family</dt><dd>{table.hostFamily}</dd></div>
              <div><dt>Event Date</dt><dd>{table.eventDate}</dd></div>
              <div><dt>Guest Capacity</dt><dd>{table.guestCapacity}</dd></div>
              <div><dt>Sleeping Arrangements</dt><dd>{table.sleeping}</dd></div>
              <div><dt>Food</dt><dd>{table.foodFull}</dd></div>
            </dl>
          </section>

          <div className="community-table-detail__actions">
            <Button onClick={() => navigate(withPreviewQuery('/Community/request-join-table'))}>
              Request to Join
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('about-event')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </CommunityScreen>
  );
}
