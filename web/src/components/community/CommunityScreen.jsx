import MobileScreen from '@/components/mobile/MobileScreen';
import CommunityBottomNav from './CommunityBottomNav';

export default function CommunityScreen({
  children,
  showBottomNav = true,
  bodyClassName = '',
}) {
  return (
    <MobileScreen bodyClassName={`community-screen${bodyClassName ? ` ${bodyClassName}` : ''}`}>
      <div className="community-screen__body">
        {children}
      </div>
      {showBottomNav ? <CommunityBottomNav /> : null}
    </MobileScreen>
  );
}
