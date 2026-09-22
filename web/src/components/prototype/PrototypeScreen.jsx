import MobileScreen from '@/components/mobile/MobileScreen';
import PrototypeBottomNav from './PrototypeBottomNav';

export default function PrototypeScreen({
  children,
  showBottomNav = true,
  bodyClassName = '',
}) {
  return (
    <MobileScreen bodyClassName={`prototype-screen${bodyClassName ? ` ${bodyClassName}` : ''}`}>
      <div className="prototype-screen__body">
        {children}
      </div>
      {showBottomNav ? <PrototypeBottomNav /> : null}
    </MobileScreen>
  );
}
