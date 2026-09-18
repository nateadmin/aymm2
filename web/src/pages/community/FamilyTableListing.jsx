import { Link, useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import { FAMILY_TABLE_LISTING } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function FamilyTableListing() {
  const navigate = useNavigate();

  return (
    <CommunityScreen>
      <div className="screen-pad mobile-onboarding">
        <header className="community-tables__header">
          <div className="community-tables__header-row">
            <h1 className="auth-heading auth-heading--brand">Family Tables</h1>
            <Link
              to={withPreviewQuery('/Community/register-table')}
              className="community-tables__register"
            >
              Register
            </Link>
          </div>
          <p className="auth-subheading">Find a seat at someone&apos;s table.</p>
        </header>

        <div className="community-table-list">
          {FAMILY_TABLE_LISTING.map((table) => (
            <button
              key={table.id}
              type="button"
              className="community-table-card"
              onClick={() => navigate(withPreviewQuery('/Community/family-table-details'))}
            >
              <img src={table.photo} alt="" className="community-table-card__photo" />
              <div className="community-table-card__body">
                <p className="community-table-card__name">{table.name}</p>
                <p className="community-table-card__meta">{table.event}</p>
                <p className="community-table-card__meta">
                  {table.location} · {table.zip}
                </p>
                <p className="community-table-card__seats">{table.seatsLeft} seats left</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </CommunityScreen>
  );
}
