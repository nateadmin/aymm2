import React, { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import SwipeRail from '@/components/shared/SwipeRail';
import Sheet from '@/components/ui/Sheet';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { entities } from '@/api/entities';
import { RELIGIONS } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useToast } from '@/lib/toast';
import { formatLabel } from '@/lib/format';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Arabic', 'Mandarin', 'Hindi', 'Portuguese',
  'Swahili', 'Russian', 'German', 'Japanese', 'Korean', 'Yoruba', 'Hausa',
  'Amharic', 'Tagalog', 'Other',
];

const EMPTY_FORM = {
  table_name: '',
  event_name: '',
  holiday: '',
  city: '',
  total_seats: '',
  beds_available: '',
  food_type: '',
  religion: '',
  language: '',
  alcohol_served: false,
  event_date: '',
  description: '',
};

export default function FamilyTables() {
  const queryClient = useQueryClient();
  const { user, isFamily } = useAuth();
  const { push } = useToast();
  const sendMessage = useSendMessage();

  const [city, setCity] = useState('');
  const [filterReligion, setFilterReligion] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [hostOpen, setHostOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [religionOpen, setReligionOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const tablesQuery = useEntityList('FamilyTable', {}, { sort: '-created_at' });
  const myRequestsQuery = useEntityList('TableRequest', { requester_email: user?.email }, {
    enabled: Boolean(user?.email),
  });
  const incomingRequestsQuery = useEntityList('TableRequest', {
    family_email: user?.email,
    status: 'pending',
  }, {
    enabled: Boolean(user?.email),
  });

  const tables = useMemo(() => (tablesQuery.data || []).filter((table) => {
    if (city && !table.city?.toLowerCase().includes(city.toLowerCase())) return false;
    if (filterReligion && table.religion !== filterReligion) return false;
    if (filterLanguage && table.language !== filterLanguage) return false;
    return true;
  }), [tablesQuery.data, city, filterReligion, filterLanguage]);

  const myRequests = myRequestsQuery.data || [];
  const incomingRequests = incomingRequestsQuery.data || [];

  const getMyRequest = (tableId) => myRequests.find((item) => item.table_id === tableId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['FamilyTable'] });
    queryClient.invalidateQueries({ queryKey: ['TableRequest'] });
  };

  const requestJoin = useMutation({
    mutationFn: (table) => entities.TableRequest.create({
      table_id: table.id,
      table_name: table.table_name,
      family_email: table.family_email,
      requester_email: user.email,
    }),
    onSuccess: () => {
      invalidate();
      push('Request to join sent!', 'success');
    },
  });

  const withdrawRequest = useMutation({
    mutationFn: async (table) => {
      const request = getMyRequest(table.id);
      if (!request) return;
      await entities.TableRequest.delete(request.id);
      if (request.status === 'accepted') {
        await entities.FamilyTable.update(table.id, {
          seats_remaining: (table.seats_remaining ?? table.total_seats) + 1,
        });
      }
    },
    onSuccess: () => {
      invalidate();
      setSelectedTable(null);
      push('Request withdrawn.', 'success');
    },
  });

  const acceptRequest = useMutation({
    mutationFn: async ({ request, table }) => {
      if ((table.seats_remaining ?? table.total_seats) <= 0) {
        throw new Error('no_seats');
      }
      await entities.TableRequest.update(request.id, { status: 'accepted' });
      await entities.FamilyTable.update(table.id, {
        seats_remaining: Math.max(0, (table.seats_remaining ?? table.total_seats) - 1),
      });
    },
    onSuccess: () => {
      invalidate();
      push('Request accepted!', 'success');
    },
    onError: (error) => {
      if (error.message === 'no_seats') {
        push('No seats remaining.', 'error');
      }
    },
  });

  const declineRequest = useMutation({
    mutationFn: (request) => entities.TableRequest.update(request.id, { status: 'declined' }),
    onSuccess: () => {
      invalidate();
      push('Request declined.', 'success');
    },
  });

  const createTable = useMutation({
    mutationFn: () => entities.FamilyTable.create({
      ...form,
      family_email: user.email,
      total_seats: Number(form.total_seats) || 0,
      seats_remaining: Number(form.total_seats) || 0,
      beds_available: form.beds_available ? Number(form.beds_available) : null,
    }),
    onSuccess: () => {
      invalidate();
      setHostOpen(false);
      setForm(EMPTY_FORM);
      push('Table created!', 'success');
    },
  });

  const selectedRequest = selectedTable ? getMyRequest(selectedTable.id) : null;
  const isHost = selectedTable?.family_email === user?.email;
  const tableIncoming = incomingRequests.filter((item) => item.table_id === selectedTable?.id);

  return (
    <PageShell
      eyebrow="Gather"
      title="Family Tables"
      description="Search holiday meal tables, request a seat, or host your own table."
    >
      <div className="page-shell__grid">
        <div className="table-filters">
          <TextField label="City" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          <label className="aymm-field">
            <span className="aymm-label">Religion</span>
            <select className="aymm-select" value={filterReligion} onChange={(e) => setFilterReligion(e.target.value)}>
              <option value="">All religions</option>
              {RELIGIONS.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
          </label>
          <label className="aymm-field">
            <span className="aymm-label">Language</span>
            <select className="aymm-select" value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)}>
              <option value="">All languages</option>
              {LANGUAGES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        {incomingRequests.length ? (
          <div className="table-banner">
            You have {incomingRequests.length} pending table request{incomingRequests.length === 1 ? '' : 's'}.
          </div>
        ) : null}

        <SwipeRail
          items={tables}
          emptyLabel="No tables match your filters."
          renderItem={(table) => {
            const request = getMyRequest(table.id);
            return (
              <button type="button" className="table-card" onClick={() => setSelectedTable(table)}>
                {table.photo_url ? (
                  <img src={table.photo_url} alt="" className="table-card__photo" />
                ) : (
                  <div className="table-card__photo table-card__photo--placeholder" />
                )}
                <div className="table-card__body">
                  <p className="table-card__title">{table.table_name}</p>
                  <p className="table-card__meta">
                    <MapPin size={14} />
                    {table.city}
                  </p>
                  <p className="table-card__meta">
                    <CalendarDays size={14} />
                    {table.event_date || table.holiday || table.event_name}
                  </p>
                  <p className="table-card__meta">
                    <Users size={14} />
                    {table.seats_remaining ?? table.total_seats} seats left
                  </p>
                  {request ? <span className="table-card__chip">{request.status}</span> : null}
                  {table.family_email === user?.email ? (
                    <span className="table-card__chip">My table</span>
                  ) : null}
                </div>
              </button>
            );
          }}
        />

        {isFamily ? (
          <Button variant="purple" onClick={() => setHostOpen(true)}>Host a Table</Button>
        ) : null}
      </div>

      <Sheet
        open={Boolean(selectedTable)}
        title={selectedTable?.table_name || 'Table detail'}
        onClose={() => setSelectedTable(null)}
      >
        {selectedTable ? (
          <div className="table-detail">
            {selectedTable.photo_url ? (
              <img src={selectedTable.photo_url} alt="" className="table-detail__hero" />
            ) : null}
            <p className="table-detail__event">{selectedTable.event_name}</p>
            <p className="aymm-muted">{selectedTable.holiday} · {selectedTable.city} · {selectedTable.event_date}</p>
            <p>{selectedTable.description || 'No description provided.'}</p>
            <ul className="table-detail__facts">
              <li>Religion: {formatLabel(selectedTable.religion) || 'Any'}</li>
              <li>Language: {selectedTable.language || 'Any'}</li>
              <li>Food: {selectedTable.food_type || 'Not specified'}</li>
              <li>Alcohol: {selectedTable.alcohol_served ? 'Served' : 'Not served'}</li>
              <li>Beds available: {selectedTable.beds_available ?? 0}</li>
            </ul>

            <div className="page-shell__grid page-shell__grid--actions">
              <Button variant="outline" onClick={() => setMessageOpen(true)}>Message host</Button>
              <Button variant="outline" onClick={() => setReligionOpen(true)}>Religion</Button>
            </div>

            {isHost ? (
              <section className="table-detail__requests">
                <h3 className="aymm-heading aymm-heading--card">Join requests</h3>
                {tableIncoming.length ? tableIncoming.map((request) => (
                  <article key={request.id} className="connection-card">
                    <div className="connection-card__body">
                      <p>{request.requester_email}</p>
                    </div>
                    <div className="connection-card__actions">
                      <Button onClick={() => acceptRequest.mutate({ request, table: selectedTable })}>Accept</Button>
                      <Button variant="outline" onClick={() => declineRequest.mutate(request)}>Decline</Button>
                    </div>
                  </article>
                )) : <p className="aymm-muted">No pending requests.</p>}
              </section>
            ) : (
              <div className="page-shell__grid page-shell__grid--actions">
                {!selectedRequest ? (
                  <Button onClick={() => requestJoin.mutate(selectedTable)}>Request to join</Button>
                ) : null}
                {selectedRequest?.status === 'pending' ? (
                  <Button variant="outline" onClick={() => withdrawRequest.mutate(selectedTable)}>Withdraw request</Button>
                ) : null}
                {selectedRequest?.status === 'accepted' ? (
                  <Button variant="outline" onClick={() => withdrawRequest.mutate(selectedTable)}>Cancel attendance</Button>
                ) : null}
                {selectedRequest?.status === 'accepted' ? (
                  <p className="aymm-muted">You are attending this table.</p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </Sheet>

      <Sheet open={hostOpen} title="Host a Table" onClose={() => setHostOpen(false)}>
        <div className="page-shell__grid">
          <TextField label="Table name" name="table_name" value={form.table_name} onChange={(e) => setForm({ ...form, table_name: e.target.value })} />
          <TextField label="Event name" name="event_name" value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} />
          <TextField label="Holiday" name="holiday" value={form.holiday} onChange={(e) => setForm({ ...form, holiday: e.target.value })} />
          <TextField label="City" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <TextField label="Event date" name="event_date" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          <TextField label="Total seats" name="total_seats" type="number" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: e.target.value })} />
          <TextField label="Beds available" name="beds_available" type="number" value={form.beds_available} onChange={(e) => setForm({ ...form, beds_available: e.target.value })} />
          <TextField label="Food type" name="food_type" value={form.food_type} onChange={(e) => setForm({ ...form, food_type: e.target.value })} />
          <label className="aymm-field">
            <span className="aymm-label">Religion</span>
            <select className="aymm-select" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })}>
              <option value="">Select religion</option>
              {RELIGIONS.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
          </label>
          <label className="aymm-field">
            <span className="aymm-label">Language</span>
            <select className="aymm-select" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="">Select language</option>
              {LANGUAGES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="aymm-field">
            <span className="aymm-label">Description</span>
            <textarea className="aymm-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </label>
          <label className="aymm-field">
            <input type="checkbox" className="aymm-check" checked={form.alcohol_served} onChange={(e) => setForm({ ...form, alcohol_served: e.target.checked })} />
            <span>Alcohol served</span>
          </label>
          <Button disabled={createTable.isPending} onClick={() => createTable.mutate()}>Create table</Button>
        </div>
      </Sheet>

      <Modal open={messageOpen} title="Message host" onClose={() => setMessageOpen(false)}>
        <textarea
          className="aymm-textarea"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
        />
        <Button
          onClick={async () => {
            await sendMessage.mutateAsync({
              toEmail: selectedTable.family_email,
              content: messageText.trim(),
              forceRequest: true,
            });
            setMessageOpen(false);
            setMessageText('');
          }}
        >
          Send message
        </Button>
      </Modal>

      <Modal open={religionOpen} title="Table religion" onClose={() => setReligionOpen(false)}>
        <p>{formatLabel(selectedTable?.religion) || 'Not specified'}</p>
      </Modal>
    </PageShell>
  );
}
