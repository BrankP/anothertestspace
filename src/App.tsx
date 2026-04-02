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
  address: string;
  website: string;
  phone: string;
  rating: number;
  distanceKm: number;
  experience: string;
};

const anchorLookup: Record<string, Anchor> = {
  mudgee: { name: 'Mudgee', lat: -32.5907, lng: 149.5876 },
  sydney: { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  melbourne: { name: 'Melbourne', lat: -37.8136, lng: 144.9631 }
};

const allActivities: Activity[] = [
  { id: '1', name: 'Burnbrae Wines', lat: -32.57934, lng: 149.50879, address: '548 Hill End Rd, Mudgee NSW 2850', website: 'burnbraewines.com.au', phone: '+61 2 6373 3504', rating: 4.7, distanceKm: 7.6, experience: 'Estate tasting flight and vineyard walk with sunset views.' },
  { id: '2', name: 'The Barn Restaurant', lat: -32.56532, lng: 149.61548, address: '17 Market St, Mudgee NSW 2850', website: 'thebarnmudgee.com.au', phone: '+61 2 6372 1108', rating: 4.6, distanceKm: 3.9, experience: 'Farm-to-table dinner with a chef tasting menu.' },
  { id: '3', name: 'Clover Cellars', lat: -32.57509, lng: 149.61531, address: '9 Winery Ln, Mudgee NSW 2850', website: 'clovercellars.au', phone: '+61 2 6372 4411', rating: 4.5, distanceKm: 3.4, experience: 'Small-batch reds and cellar-door storytelling session.' },
  { id: '4', name: 'Mudgee Golf Club', lat: -32.60532, lng: 149.59347, address: '36 Robertson St, Mudgee NSW 2850', website: 'mudgeegolf.com', phone: '+61 2 6372 1811', rating: 4.4, distanceKm: 1.8, experience: '9-hole social round with equipment hire included.' },
  { id: '5', name: 'Avisford Nature Reserve', lat: -32.62211, lng: 149.57508, address: 'Avisford Track, Mudgee NSW 2850', website: 'visitmudgee.com/avisford', phone: '+61 2 6378 2850', rating: 4.3, distanceKm: 3.7, experience: 'Guided bush walk with native wildlife spotting.' },
  { id: '6', name: 'Lowe Family Wine Co', lat: -32.6005, lng: 149.5801, address: '327 Tinja Ln, Mudgee NSW 2850', website: 'lowewine.com.au', phone: '+61 2 6372 0800', rating: 4.8, distanceKm: 1.5, experience: 'Premium wine tasting paired with regional cheese board.' },
  { id: '7', name: 'Mudgee Brewing Company', lat: -32.5902, lng: 149.5887, address: 'Unit 5 Church St, Mudgee NSW 2850', website: 'mudgeebrewingco.au', phone: '+61 2 6372 2299', rating: 4.5, distanceKm: 0.2, experience: 'Craft beer paddle and behind-the-scenes brew tour.' },
  { id: '8', name: 'Gulgong Pony Club', lat: -32.33172, lng: 149.53071, address: 'Racecourse Rd, Gulgong NSW 2852', website: 'gulgongponyclub.org.au', phone: '+61 2 6374 1133', rating: 4.2, distanceKm: 29.4, experience: 'Family horse-riding lesson with beginner coaching.' },
  { id: '9', name: 'Gulgong Pioneers Museum', lat: -32.36051, lng: 149.53526, address: '56 Herbert St, Gulgong NSW 2852', website: 'gulgongmuseum.au', phone: '+61 2 6374 2050', rating: 4.6, distanceKm: 26.2, experience: 'Local heritage exhibits and interactive gold-rush stories.' },
  { id: '10', name: 'Gulgong Gold Experience', lat: -32.3458, lng: 149.5314, address: '12 Goldfields Way, Gulgong NSW 2852', website: 'gulgonggoldexperience.au', phone: '+61 2 6374 9022', rating: 4.3, distanceKm: 27.8, experience: 'Hands-on panning activity with guided history talk.' },
  { id: '11', name: 'Prince of Wales Opera House', lat: -32.3552, lng: 149.5321, address: '97 Mayne St, Gulgong NSW 2852', website: 'powoperahouse.com.au', phone: '+61 2 6374 9900', rating: 4.7, distanceKm: 26.8, experience: 'Live performance venue tour and backstage access.' },
  { id: '12', name: 'Gulgong Holtermann Museum', lat: -32.3579, lng: 149.5348, address: '123 Mayne St, Gulgong NSW 2852', website: 'holtermannmuseum.au', phone: '+61 2 6374 1240', rating: 4.4, distanceKm: 26.5, experience: 'Photography archive and local community stories.' },
  { id: '13', name: 'Gulgong Markets', lat: -32.3491, lng: 149.5332, address: 'Anzac Park, Gulgong NSW 2852', website: 'gulgongmarkets.org', phone: '+61 2 6374 8765', rating: 4.1, distanceKm: 27.2, experience: 'Weekend stalls with handmade crafts and produce.' },
  { id: '14', name: 'Gulgong Brewery', lat: -32.3405, lng: 149.5299, address: '8 Brewery Lane, Gulgong NSW 2852', website: 'gulgongbrewery.au', phone: '+61 2 6374 3001', rating: 4.2, distanceKm: 28.1, experience: 'Microbrew tasting room with live acoustic sessions.' },
  { id: '15', name: 'Pegasus Putt Putt', lat: -32.26387, lng: 148.65287, address: '42 Family Fun Rd, Dubbo NSW 2830', website: 'pegasusputtputt.com.au', phone: '+61 2 6882 7711', rating: 4.0, distanceKm: 63.7, experience: 'Mini-golf course with lights and themed holes.' },
  { id: '16', name: 'Dundullimal Homestead', lat: -32.28593, lng: 148.60326, address: '23L Obley Rd, Dubbo NSW 2830', website: 'dundullimal.org.au', phone: '+61 2 6884 5250', rating: 4.6, distanceKm: 68.1, experience: 'Historic homestead tour with volunteer guides.' },
  { id: '17', name: 'Dubbo Zoo', lat: -32.27294, lng: 148.58438, address: 'Obley Rd, Dubbo NSW 2830', website: 'taronga.org.au/dubbo-zoo', phone: '+61 2 6881 1400', rating: 4.8, distanceKm: 70.4, experience: 'Open-range safari loop with keeper talks.' },
  { id: '18', name: 'Dubbo Observatory', lat: -32.2932, lng: 148.58395, address: '17L Camp Rd, Dubbo NSW 2830', website: 'dubboobservatory.com.au', phone: '+61 2 6885 1555', rating: 4.7, distanceKm: 71.5, experience: 'Night-sky telescope session with astronomy guides.' },
  { id: '19', name: 'Old Dubbo Gaol', lat: -32.2561, lng: 148.6024, address: '90 Macquarie St, Dubbo NSW 2830', website: 'olddubbogaol.com.au', phone: '+61 2 6801 4460', rating: 4.4, distanceKm: 67.2, experience: 'Immersive historic prison walkthrough and exhibits.' },
  { id: '20', name: 'Taronga Western Plains Cafe', lat: -32.2708, lng: 148.5895, address: 'Taronga Dr, Dubbo NSW 2830', website: 'tarongacafe.au', phone: '+61 2 6881 1540', rating: 4.1, distanceKm: 69.8, experience: 'Casual brunch stop with zoo-view seating.' },
  { id: '21', name: 'Dubbo Regional Theatre', lat: -32.2547, lng: 148.6011, address: 'Wingewarra St, Dubbo NSW 2830', website: 'dubbotheatre.com.au', phone: '+61 2 6801 4378', rating: 4.5, distanceKm: 67.4, experience: 'Evening performance with foyer drinks package.' }
];

const App = () => {
  const [query, setQuery] = useState('Mudgee');
  const [anchor, setAnchor] = useState<Anchor>(anchorLookup.mudgee);

  const activities = useMemo(() => allActivities, []);

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
        <p className="hint">21 provided dummy activities loaded around regional NSW.</p>
      </header>

      <main className="map-wrap">
        <ActivityMap anchor={anchor} activities={activities} />
        <section className="suggested-paths" aria-label="Suggested starting paths">
          <h2>Suggested starting paths</h2>
          <div className="viewing-row">
            <p>Viewing: 3-Day Highlights</p>
            <button type="button" className="clear-chip">
              Clear
            </button>
          </div>
          <div className="path-button-row">
            <button type="button" className="path-button path-button-active">
              3-Day Highlights
            </button>
            <button type="button" className="path-button">
              Romantic Sydney
            </button>
            <button type="button" className="path-button">
              Hidden + Local
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
