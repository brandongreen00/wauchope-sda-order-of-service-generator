import SongRow from './SongRow.jsx';
import { KEYS } from '../data/keys.js';

function makeBlankSong() {
  return {
    id: crypto.randomUUID(),
    number: null,
    title: '',
    key: KEYS[0],
    modulation: null,
  };
}

export default function PraiseWorshipSection({ songs, kidsSong, onSongsChange, onKidsSongChange }) {
  function updateSong(id, next) {
    onSongsChange(songs.map((s) => (s.id === id ? { ...next, id } : s)));
  }
  function removeSong(id) {
    onSongsChange(songs.filter((s) => s.id !== id));
  }
  function addSong() {
    onSongsChange([...songs, makeBlankSong()]);
  }
  return (
    <div className="section">
      <h2>Praise &amp; Worship</h2>
      {songs.map((s) => (
        <SongRow
          key={s.id}
          value={s}
          onChange={(next) => updateSong(s.id, next)}
          onRemove={() => removeSong(s.id)}
        />
      ))}
      <div className="add-song">
        <button type="button" className="btn" onClick={addSong}>+ Add song</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <SongRow
          label="Kids Song"
          value={kidsSong}
          onChange={onKidsSongChange}
          hideSearch
        />
      </div>
    </div>
  );
}
