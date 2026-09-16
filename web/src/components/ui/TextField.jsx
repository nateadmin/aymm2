export default function TextField({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  const fieldId = id || props.name;

  return (
    <label className={`aymm-field ${className}`.trim()} htmlFor={fieldId}>
      {label ? <span className="aymm-label">{label}</span> : null}
      <input
        id={fieldId}
        className={`aymm-input${error ? ' aymm-input--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="aymm-field-error" role="alert">{error}</span> : null}
    </label>
  );
}
