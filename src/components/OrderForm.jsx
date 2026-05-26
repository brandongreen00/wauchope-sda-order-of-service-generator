import PeopleSection from './PeopleSection.jsx';
import ClassesSection from './ClassesSection.jsx';
import PraiseWorshipSection from './PraiseWorshipSection.jsx';
import HymnsSection from './HymnsSection.jsx';
import { MONTHS } from '../data/keys.js';

export default function OrderForm({ state, setState, onGenerate, generating }) {
  function updateDate(patch) {
    setState({ ...state, date: { ...state.date, ...patch } });
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
      <div className="section">
        <h2>Date</h2>
        <div className="date-row">
          <input
            type="number"
            min="1"
            max="31"
            value={state.date.day}
            onChange={(e) => updateDate({ day: e.target.value })}
            aria-label="Day"
          />
          <select
            value={state.date.month}
            onChange={(e) => updateDate({ month: e.target.value })}
            aria-label="Month"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <PeopleSection
        value={state.people}
        onChange={(people) => setState({ ...state, people })}
      />

      <ClassesSection
        value={state.classes}
        onChange={(classes) => setState({ ...state, classes })}
      />

      <PraiseWorshipSection
        songs={state.praiseWorship}
        kidsSong={state.kidsSong}
        onSongsChange={(praiseWorship) => setState({ ...state, praiseWorship })}
        onKidsSongChange={(kidsSong) => setState({ ...state, kidsSong })}
      />

      <HymnsSection
        value={state.hymns}
        onChange={(hymns) => setState({ ...state, hymns })}
      />

      <div className="generate">
        <button type="submit" className="btn btn-primary" disabled={generating}>
          {generating ? 'Generating…' : 'Generate PDF'}
        </button>
      </div>
    </form>
  );
}
