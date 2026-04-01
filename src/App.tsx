import { useMemo, useState } from 'react';
import ActivityMap from './components/ActivityMap';

export type Anchor = {
  name: string;
  lat: number;
  lng: number;
};

export type Activity = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
};

const anchorLookup: Record<string, Anchor> = {
  mudgee: { name: 'Mudgee', lat: -32.5907, lng: 149.5876 },
  sydney: { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  melbourne: { name: 'Melbourne', lat: -37.8136, lng: 144.9631 }
};

const mudgeeActivities: Activity[] = [
  { id: '1', name: 'Winery Tour', lat: -32.612, lng: 149.576, category: 'Food & Drink' },
  { id: '2', name: 'Town Market', lat: -32.587, lng: 149.592, category: 'Shopping' },
  { id: '3', name: 'Lookout Walk', lat: -32.575, lng: 149.605, category: 'Nature' },
  { id: '4', name: 'River Picnic', lat: -32.603, lng: 149.61, category: 'Outdoors' },
  { id: '5', name: 'Art Gallery', lat: -32.594, lng: 149.581, category: 'Culture' }
];

const App = () => {
  const [query, setQuery] = useState('Mudgee');
  const [anchor, setAnchor] = useState<Anchor>(anchorLookup.mudgee);
  const [selected, setSelected] = useState<Activity | null>(null);

  const activities = useMemo(() => {
    return mudgeeActivities;
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim().toLowerCase();
    const found = anchorLookup[normalized] ?? anchorLookup.mudgee;
    setAnchor(found);
    setSelected(null);
  };

  return (
    <div className="app-shell">
      <header className="top-panel">
        <h1>Nearby Activities</h1>
        <form onSubmit={handleSearch} className="search-row">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter location (try Mudgee)"
            aria-label="Location"
          />
          <button type="submit">Set Anchor</button>
        </form>
        <p className="hint">Showing mock activities around {anchor.name}.</p>
      </header>

      <main className="map-wrap">
        <ActivityMap
          anchor={anchor}
          activities={activities}
          onActivityTap={setSelected}
        />
      </main>

      <footer className="bottom-sheet" role="status" aria-live="polite">
        {selected ? (
          <>
            <strong>{selected.name}</strong>
            <span>{selected.category}</span>
          </>
        ) : (
          <span>Tap a node to view an activity.</span>
        )}
      </footer>
    </div>
  );
};

export default App;
