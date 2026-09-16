export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="modal-shell__backdrop" aria-label="Close" onClick={onClose} />
      <div className="modal-shell__panel">
        <header className="modal-shell__header">
          <h2 className="aymm-heading aymm-heading--section">{title}</h2>
          <button type="button" className="aymm-button aymm-button--ghost" onClick={onClose}>Close</button>
        </header>
        <div className="modal-shell__body">{children}</div>
      </div>
    </div>
  );
}
