export default function ClassesSection({ value, onChange }) {
  function update(key, val) {
    onChange({ ...value, [key]: val });
  }
  return (
    <div className="section">
      <h2>Classes</h2>
      <div className="field-row">
        <label htmlFor="frontOfChurch">Front of Church</label>
        <input id="frontOfChurch" type="text" value={value.frontOfChurch} onChange={(e) => update('frontOfChurch', e.target.value)} />
      </div>
      <div className="field-row">
        <label htmlFor="backOfChurch">Back of Church</label>
        <input id="backOfChurch" type="text" value={value.backOfChurch} onChange={(e) => update('backOfChurch', e.target.value)} />
      </div>
      <div className="field-row">
        <label htmlFor="seekersHall">Seeker's (Hall)</label>
        <input id="seekersHall" type="text" value={value.seekersHall} onChange={(e) => update('seekersHall', e.target.value)} />
      </div>
      <div className="field-row">
        <label htmlFor="threeAngels">3 Angels Class</label>
        <input id="threeAngels" type="text" value={value.threeAngels} onChange={(e) => update('threeAngels', e.target.value)} />
      </div>
    </div>
  );
}
