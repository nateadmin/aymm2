import Button from './Button';

export default function SocialAuthButton({ icon, children, onClick }) {
  return (
    <Button variant="social" onClick={onClick}>
      {icon}
      <span>{children}</span>
    </Button>
  );
}
