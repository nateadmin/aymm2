export default function BlockedAccountOverlay() {
  return (
    <div className="blocked-overlay">
      <div className="blocked-overlay__panel">
        <h1 className="aymm-heading aymm-heading--page">Account blocked</h1>
        <p className="aymm-muted">
          Your AYMM account has been blocked by an administrator. Contact support if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
