import React, { useState } from 'react';
import PageShell from '@/components/PageShell';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import Sheet from '@/components/ui/Sheet';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';

export default function FamilyTables() {
  const { isFamily } = useAuth();
  const [city, setCity] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);
  const tablesQuery = useEntityList('FamilyTable', {}, { sort: '-created_at' });

  return (
    <PageShell
      eyebrow="Gather"
      title="Family Tables"
      description="Search holiday meal tables, request a seat, or host your own table."
    >
      <div className="page-shell__grid">
        <PlaceholderPanel title="Search and filters">
          <input className="aymm-input" placeholder="Search by city" value={city} onChange={(e) => setCity(e.target.value)} />
          <p className="aymm-muted">Religion and language filters placeholder.</p>
        </PlaceholderPanel>
        <PlaceholderPanel title="Table cards rail" description="Swipe rail of hosted tables with status chips.">
          {(tablesQuery.data || [])
            .filter((table) => !city || table.city?.toLowerCase().includes(city.toLowerCase()))
            .map((table) => (
              <button key={table.id} type="button" className="aymm-pill-action" onClick={() => setDetailOpen(true)}>
                {table.table_name} · {table.city}
              </button>
            ))}
        </PlaceholderPanel>
        {isFamily ? (
          <button type="button" className="aymm-button aymm-button--purple" onClick={() => setHostOpen(true)}>
            Host a Table
          </button>
        ) : null}
      </div>

      <Sheet open={detailOpen} title="Table detail" onClose={() => setDetailOpen(false)}>
        <PlaceholderPanel title="Event detail" description="Hero photo, attributes, message host, religion, and join request flow." />
      </Sheet>

      <Sheet open={hostOpen} title="Host a Table" onClose={() => setHostOpen(false)}>
        <PlaceholderPanel title="Host form" description="Table name, event, holiday, city, date, seats, beds, food, religion, language, description, alcohol." />
      </Sheet>
    </PageShell>
  );
}
