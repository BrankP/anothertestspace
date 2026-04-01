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
  experience: string;
  distanceKm: number;
};

const anchorLookup: Record<string, Anchor> = {
  mudgee: { name: 'Mudgee', lat: -32.5907, lng: 149.5876 },
  sydney: { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  melbourne: { name: 'Melbourne', lat: -37.8136, lng: 144.9631 }
};

const activityTemplates = [
  { category: 'Food & Drink', experience: 'Guided tasting session with local produce pairing.' },
  { category: 'Nature', experience: 'Scenic walking track with photo stops at sunset.' },
  { category: 'Culture', experience: 'Short workshop with local artists and craft makers.' },
  { category: 'Outdoors', experience: 'Relaxed outdoor session with family-friendly setup.' }
];

const createDummyActivities = (anchor: Anchor): Activity[] => {
  const activities: Activity[] = [];

  for (let index = 0; index < 10; index += 1) {
    const template = activityTemplates[index % activityTemplates.length];
    activities.push({
      id: `east-${index + 1}`,
      name: `East Experience ${index + 1}`,
      lat: anchor.lat + 0.008 * (index % 5) - 0.016,
      lng: anchor.lng + 0.012 + index * 0.005,
      category: template.category,
      experience: template.experience,
      distanceKm: Number((1.1 + index * 0.3).toFixed(1))
    });
  }

  for (let index = 0; index < 10; index += 1) {
    const template = activityTemplates[(index + 1) % activityTemplates.length];
    activities.push({
      id: `west-${index + 1}`,
      name: `West Experience ${index + 1}`,
      lat: anchor.lat + 0.008 * (index % 5) - 0.016,
      lng: anchor.lng - 0.012 - index * 0.005,
      category: template.category,
      experience: template.experience,
      distanceKm: Number((1.2 + index * 0.3).toFixed(1))
    });
  }

  return activities;
};

const App = () => {
  const [query, setQuery] = useState('Mudgee');
  const [anchor, setAnchor] = useState<Anchor>(anchorLookup.mudgee);

  const activities = useMemo(() => {
    return createDummyActivities(anchor);
  }, [anchor]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim().toLowerCase();
    const found = anchorLookup[normalized] ?? anchorLookup.mudgee;
    setAnchor(found);
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
        <p className="hint">20 dummy activities loaded ({anchor.name} anchor).</p>
      </header>

      <main className="map-wrap">
        <ActivityMap anchor={anchor} activities={activities} />
      </main>
    </div>
  );
};

export default App;
