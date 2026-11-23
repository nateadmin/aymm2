import { DIETARY_CERTIFICATION_OPTIONS } from '@/lib/communityTableListing';

/**
 * Structured host inputs for family table listings (seats, date, food, dietary, guest expectations).
 */
export default function HostFamilyTableFields({ value, onChange }) {
  const update = (key, fieldValue) => onChange({ ...value, [key]: fieldValue });

  return (
    <div className="discovery-form-list community-host-table-fields">
      <label className="auth-field">
        <span className="auth-field__label">Seats available</span>
        <input
          className="aymm-input"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="e.g. 4"
          value={value.seatsLeft ?? ''}
          onChange={(event) => update('seatsLeft', event.target.value)}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field__label">Event date</span>
        <input
          className="aymm-input"
          type="date"
          value={value.eventDateISO ?? ''}
          onChange={(event) => {
            const iso = event.target.value;
            const display = iso
              ? new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : '';
            onChange({ ...value, eventDateISO: iso, eventDate: display });
          }}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field__label">Food guests can expect</span>
        <textarea
          className="aymm-textarea discovery-form-list__textarea"
          rows={3}
          placeholder="Describe the meal, sides, and dietary accommodations..."
          value={value.food ?? ''}
          onChange={(event) => {
            const food = event.target.value;
            onChange({ ...value, food, foodFull: food });
          }}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field__label">Kosher or halal?</span>
        <select
          className="aymm-select"
          value={value.dietaryCertification ?? 'neither'}
          onChange={(event) => update('dietaryCertification', event.target.value)}
        >
          {DIETARY_CERTIFICATION_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="auth-field">
        <span className="auth-field__label">What guests should expect or bring</span>
        <textarea
          className="aymm-textarea discovery-form-list__textarea"
          rows={3}
          placeholder="e.g. We provide everything; optional side dish welcome..."
          value={value.guestExpectations ?? ''}
          onChange={(event) => update('guestExpectations', event.target.value)}
        />
      </label>
    </div>
  );
}