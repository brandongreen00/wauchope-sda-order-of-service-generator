import SongRow from './SongRow.jsx';

export default function HymnsSection({ value, onChange }) {
  function update(slot, next) {
    onChange({ ...value, [slot]: next });
  }
  return (
    <div className="section">
      <h2>Hymns</h2>
      <SongRow
        label="Invocational"
        value={value.invocational}
        onChange={(next) => update('invocational', next)}
      />
      <SongRow
        label="Hymn (post-offering)"
        value={value.postOffering}
        onChange={(next) => update('postOffering', next)}
      />
      <SongRow
        label="Hymn (before sermon)"
        value={value.beforeSermon}
        onChange={(next) => update('beforeSermon', next)}
      />
      <SongRow
        label="Closing Hymn"
        value={value.closing}
        onChange={(next) => update('closing', next)}
      />
    </div>
  );
}
