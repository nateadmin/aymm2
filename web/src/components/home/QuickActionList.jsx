import { ChevronRight } from 'lucide-react';

export default function QuickActionList({ actions, onAction }) {
  return actions.map((action) => (
    <button
      key={action.id}
      type="button"
      className="quick-action-card"
      onClick={() => onAction(action)}
    >
      <div>
        <p className="quick-action-card__title">{action.title}</p>
        <p className="quick-action-card__desc">{action.description}</p>
      </div>
      <ChevronRight className="quick-action-card__chevron" size={18} />
    </button>
  ));
}