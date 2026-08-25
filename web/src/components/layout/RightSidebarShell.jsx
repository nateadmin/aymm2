export default function RightSidebarShell() {
  return (
    <aside className="app-right-sidebar" aria-label="Secondary">
      <p className="right-sidebar-shell__title">Right sidebar shell</p>
      <div className="page-shell__grid">
        <div className="right-sidebar-shell__slot">At a glance panel</div>
        <div className="right-sidebar-shell__slot">Suggested connections panel</div>
        <div className="right-sidebar-shell__slot">Profile detail / message modals mount here later</div>
      </div>
    </aside>
  );
}
