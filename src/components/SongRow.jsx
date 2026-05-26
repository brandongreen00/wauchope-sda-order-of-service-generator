import HymnSearchInput from './HymnSearchInput.jsx';
import { KEYS } from '../data/keys.js';

export default function SongRow({ label, value, onChange, onRemove, hideSearch = false }) {
  const modulationEnabled = value.modulation !== null && value.modulation !== undefined;

  function update(patch) {
    onChange({ ...value, ...patch });
  }

  function toggleModulation(e) {
    if (e.target.checked) {
      update({ modulation: value.key || KEYS[0] });
    } else {
      update({ modulation: null });
    }
  }

  return (
    <div className={`song-row ${label ? 'with-label' : ''}`}>
      {label && <div className="row-label">{label}</div>}

      {hideSearch ? (
        <div className="hymn-search">
          <input
            type="text"
            placeholder="Song title"
            value={value.title || ''}
            onChange={(e) => update({ title: e.target.value })}
          />
        </div>
      ) : (
        <HymnSearchInput value={value} onChange={onChange} />
      )}

      <select
        value={value.key || ''}
        onChange={(e) => update({ key: e.target.value })}
        aria-label="Key"
      >
        <option value="">Key</option>
        {KEYS.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      <label className="modulation">
        <input
          type="checkbox"
          checked={modulationEnabled}
          onChange={toggleModulation}
          aria-label="Modulates to"
        />
        <span>→</span>
      </label>

      <select
        value={value.modulation || ''}
        onChange={(e) => update({ modulation: e.target.value })}
        disabled={!modulationEnabled}
        aria-label="Modulates to key"
      >
        <option value="">Key</option>
        {KEYS.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      {onRemove ? (
        <button type="button" className="btn-remove" onClick={onRemove} aria-label="Remove song">
          ×
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
