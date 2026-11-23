import HostFamilyTableFields from '@/components/community/HostFamilyTableFields';

/**
 * Full host/register form — same fields on Register Table and Family Table Listing editor.
 */
export default function FamilyTableHostForm({ value, onChange }) {
  const update = (key, fieldValue) => onChange({ ...value, [key]: fieldValue });

  return (
    <div className="discovery-form-list community-host-table-form">
      <label className="auth-field">
        <span className="auth-field__label">AYMM Family Username</span>
        <input
          className="aymm-input"
          placeholder="@yourfamilyname"
          value={value.username ?? ''}
          onChange={(event) => update('username', event.target.value)}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field__label">Address</span>
        <input
          className="aymm-input"
          placeholder="123 Main St, City, State ZIP"
          value={value.address ?? ''}
          onChange={(event) => update('address', event.target.value)}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field__label">Phone Number</span>
        <input
          className="aymm-input"
          placeholder="(555) 000-0000"
          value={value.phone ?? ''}
          onChange={(event) => update('phone', event.target.value)}
        />
      </label>

      <div className="community-register-table__listing">
        <h2 className="auth-field__label">Listing details</h2>
        <HostFamilyTableFields value={value} onChange={onChange} />
      </div>

      <label className="auth-field">
        <span className="auth-field__label">About your gathering</span>
        <textarea
          className="aymm-textarea discovery-form-list__textarea"
          rows={4}
          placeholder="Atmosphere, who you hope to welcome, house rules..."
          value={value.details ?? ''}
          onChange={(event) => update('details', event.target.value)}
        />
      </label>
    </div>
  );
}