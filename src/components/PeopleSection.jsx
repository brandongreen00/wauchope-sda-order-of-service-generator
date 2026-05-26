export default function PeopleSection({ value, onChange }) {
  function update(key, val) {
    onChange({ ...value, [key]: val });
  }
  return (
    <div className="section">
      <h2>People</h2>
      <div className="field-row">
        <label htmlFor="av">AV</label>
        <input id="av" type="text" value={value.av} onChange={(e) => update('av', e.target.value)} />
      </div>
      <div className="field-row">
        <label htmlFor="pianist">Pianist</label>
        <input id="pianist" type="text" value={value.pianist} onChange={(e) => update('pianist', e.target.value)} />
      </div>
      <div className="field-row">
        <label htmlFor="songTeam">Song Team</label>
        <input id="songTeam" type="text" value={value.songTeam} onChange={(e) => update('songTeam', e.target.value)} />
      </div>
    </div>
  );
}
