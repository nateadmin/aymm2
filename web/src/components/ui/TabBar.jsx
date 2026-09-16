export default function TabBar({ tabs, activeId, onChange, badgeCounts = {} }) {
  return (
    <div className="tab-bar" role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const badge = badgeCounts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tab-bar__tab${active ? ' tab-bar__tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            {badge ? <span className="tab-bar__badge">{badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
