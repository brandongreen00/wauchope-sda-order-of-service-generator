import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';

let hymnsPromise = null;
function loadHymns() {
  if (!hymnsPromise) {
    hymnsPromise = fetch(`${import.meta.env.BASE_URL}hymns.json`).then((r) => r.json());
  }
  return hymnsPromise;
}

export default function HymnSearchInput({ value, onChange }) {
  const [hymns, setHymns] = useState([]);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value.title || '');
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadHymns().then(setHymns);
  }, []);

  // Keep input in sync if the value.title changes externally (e.g. picking a suggestion).
  useEffect(() => {
    setQuery(value.title || '');
  }, [value.title]);

  const fuse = useMemo(
    () => new Fuse(hymns, { keys: ['title'], threshold: 0.3, ignoreLocation: true }),
    [hymns]
  );

  const hymnByNumber = useMemo(() => {
    const map = new Map();
    for (const h of hymns) map.set(h.number, h);
    return map;
  }, [hymns]);

  // Close on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleTitleChange(e) {
    const next = e.target.value;
    setQuery(next);
    onChange({ ...value, title: next });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!next.trim() || hymns.length === 0) {
        setResults([]);
        setOpen(false);
        return;
      }
      const matches = fuse.search(next, { limit: 8 }).map((m) => m.item);
      setResults(matches);
      setOpen(matches.length > 0);
    }, 150);
  }

  function handleNumberChange(e) {
    const raw = e.target.value;
    const num = raw === '' ? null : parseInt(raw, 10);
    const validNum = Number.isFinite(num) ? num : null;
    // Auto-fill the title from the catalogue when the number resolves to a
    // known hymn. If the number is empty or unknown, leave the title alone
    // so a manually typed title is not clobbered.
    const match = validNum != null ? hymnByNumber.get(validNum) : null;
    if (match) {
      onChange({ ...value, number: validNum, title: match.title });
    } else {
      onChange({ ...value, number: validNum });
    }
  }

  function pickSuggestion(h) {
    onChange({ ...value, number: h.number, title: h.title });
    setQuery(h.title);
    setOpen(false);
  }

  return (
    <div className="hymn-search" ref={containerRef}>
      <input
        type="text"
        placeholder="Hymn title"
        value={query}
        onChange={handleTitleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      <input
        type="number"
        className="number-input"
        placeholder="No."
        value={value.number ?? ''}
        onChange={handleNumberChange}
        min="1"
      />
      {open && results.length > 0 && (
        <div className="suggestions">
          {results.map((h) => (
            <button
              type="button"
              key={h.number}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickSuggestion(h)}
            >
              <span className="num">{h.number}</span>
              {h.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
