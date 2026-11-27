export default function Modal({ open, title, onClose, children, bodyClassName = '' }) {
  if (!open) return null;

  const shellClass = bodyClassName ? `modal-shell modal-shell--${bodyClassName}` : 'modal-shell';
  const bodyClasses = ['modal-shell__body', bodyClassName ? `modal-shell__body--${bodyClassName}` : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClass} role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="modal-shell__backdrop" aria-label="Close" onClick={onClose} />
      <div className="modal-shell__panel">
        <header className="modal-shell__header">
          <h2 className="aymm-heading aymm-heading--section">{title}</h2>
          <button type="button" className="aymm-button aymm-button--ghost" onClick={onClose}>Close</button>
        </header>
        <div className={bodyClasses}>{children}</div>
      </div>
    </div>
  );
}
