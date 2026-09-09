export default function SwipeRail({ items, renderItem, emptyLabel = 'Nothing to show yet.' }) {
  if (!items?.length) {
    return <div className="swipe-rail swipe-rail--empty">{emptyLabel}</div>;
  }

  return (
    <div className="swipe-rail">
      {items.map((item, index) => (
        <div key={item.id || index} className="swipe-rail__item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
