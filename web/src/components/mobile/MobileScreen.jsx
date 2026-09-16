import { Signal, Wifi, Battery } from 'lucide-react';

export default function MobileScreen({
  children,
  showStatusBar = true,
  className = '',
  bodyClassName = '',
}) {
  return (
    <div className="mobile-canvas">
      <div className={`mobile-screen ${className}`.trim()}>
        {showStatusBar ? (
          <header className="mobile-screen__status" aria-hidden="true">
            <span className="mobile-screen__status-time">9:41</span>
            <div className="mobile-screen__status-icons">
              <Signal size={14} strokeWidth={2} />
              <Wifi size={14} strokeWidth={2} />
              <Battery size={14} strokeWidth={2} />
            </div>
          </header>
        ) : null}
        <div className={`mobile-screen__body ${bodyClassName}`.trim()}>
          {children}
        </div>
      </div>
    </div>
  );
}
