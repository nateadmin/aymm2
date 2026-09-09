export default function Sheet({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="sheet-shell" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="sheet-shell__backdrop" aria-label="Close" onClick={onClose} />
      <div className="sheet-shell__panel">
        <header className="sheet-shell__header">
          <h2 className="aymm-heading aymm-heading--section">{title}</h2>
          <button type="button" className="aymm-button aymm-button--ghost" onClick={onClose}>Close</button>
        </header>
        <div className="sheet-shell__body">{children}</div>
      </div>
    </div>
  );
}
