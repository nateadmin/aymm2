import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';

export default function OTP() {
  return (
    <MobileScreen>
      <div className="screen-pad screen-pad--auth">
        <BackButton to="/PhoneLogin" />
        <PlaceholderPanel
          title="Enter verification code"
          description="OTP screen from Figma — wiring next."
        />
      </div>
    </MobileScreen>
  );
}
