export default function RightSidebarShell() {
  return (
    <aside className="app-right-sidebar" aria-label="Secondary">
      <h2 className="right-sidebar-shell__title">At a glance</h2>
      <div className="page-shell__grid">
        <div className="right-sidebar-shell__slot aymm-panel">Connections summary</div>
        <div className="right-sidebar-shell__slot aymm-panel">Suggested profiles</div>
      </div>
    </aside>
  );
}
