import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';

export default function AuthPage({
  as: Tag = 'div',
  backTo,
  header,
  footer,
  align = 'center',
  onSubmit,
  children,
}) {
  return (
    <MobileScreen>
      <Tag className="screen-pad screen-pad--auth auth-page" onSubmit={onSubmit}>
        {backTo ? <BackButton to={backTo} /> : null}
        {header ? (
          <div className={`auth-header${align === 'start' ? ' auth-header--start' : ''}`}>
            {header}
          </div>
        ) : null}
        <div className="auth-page__spacer" aria-hidden="true" />
        <div className="auth-page__body">{children}</div>
        <div className="auth-page__spacer" aria-hidden="true" />
        {footer ? <div className="auth-page__footer">{footer}</div> : null}
      </Tag>
    </MobileScreen>
  );
}
