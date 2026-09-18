import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import { JOHNSON_TABLE } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function FamilyTableDetails() {
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
          <h1 className="community-table-detail__about-title">About This Event</h1>
          <p className="community-table-detail__about-copy">{table.about}</p>

          <dl className="community-table-detail__about-facts">
            <div><dt>Host Family</dt><dd>{table.hostFamily}</dd></div>
            <div><dt>Event Date</dt><dd>{table.eventDate}</dd></div>
            <div><dt>Guest Capacity</dt><dd>{table.guestCapacity}</dd></div>
            <div><dt>Sleeping Arrangements</dt><dd>{table.sleeping}</dd></div>
            <div><dt>Food</dt><dd>{table.foodFull}</dd></div>
          </dl>
        </div>
      </div>
    </CommunityScreen>
  );
}
