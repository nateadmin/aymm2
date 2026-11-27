import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import MobileHandheldFooter from '@/components/mobile/MobileHandheldFooter';
import Button from '@/components/ui/Button';
import FamilyTableHostForm from '@/components/community/FamilyTableHostForm';
import {
  emitCommunityTableListingUpdated,
  isRegisterFormComplete,
  loadCommunityTableListing,
  registerFormFromTable,
  saveCommunityTableListing,
  tablePatchFromRegisterForm,
} from '@/lib/communityTableListing';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function RegisterTable() {
  const navigate = useNavigate();
  const initialForm = useMemo(() => registerFormFromTable(loadCommunityTableListing()), []);
  const [form, setForm] = useState(initialForm);

  const valid = isRegisterFormComplete(form);

  const registerTable = () => {
    const patch = tablePatchFromRegisterForm(form);
    saveCommunityTableListing(patch);
    emitCommunityTableListingUpdated();
    navigate(withPreviewQuery('/Community/table-confirmation'));
  };

  return (
    <CommunityScreen showBottomNav={false} bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Community/family-table-listing')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">Register Your Table</h1>
            <p className="auth-subheading">Open your home and let families find you.</p>
          </div>

          <FamilyTableHostForm value={form} onChange={setForm} />
        </div>

        <MobileHandheldFooter>
          <Button
            variant={valid ? 'primary' : 'disabled'}
            disabled={!valid}
            onClick={registerTable}
          >
            Register Table
          </Button>
        </MobileHandheldFooter>
      </div>
    </CommunityScreen>
  );
}