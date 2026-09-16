export default function HeartLogo({ className = '', alt = 'AYMM heart logo', ...props }) {
  return (
    <img
      src="/brand/heart-logo.png"
      alt={alt}
      className={`heart-logo${className ? ` ${className}` : ''}`}
      decoding="async"
      {...props}
    />
  );
}
