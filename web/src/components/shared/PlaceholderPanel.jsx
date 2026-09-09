export default function PlaceholderPanel({ title, description, children }) {
  return (
    <section className="aymm-panel" data-placeholder-panel={title}>
      {title ? <h2 className="aymm-heading aymm-heading--card">{title}</h2> : null}
      {description ? <p className="aymm-muted">{description}</p> : null}
      {children}
    </section>
  );
}
