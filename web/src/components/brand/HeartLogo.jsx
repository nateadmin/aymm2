export default function HeartLogo({ className = '', alt = 'AYMM heart logo', ...props }) {
  return (
    <img
      src="/brand/heart-logo.png"
      alt={alt}
      className={className}
      width={112}
      height={112}
      decoding="async"
      {...props}
    />
  );
}
