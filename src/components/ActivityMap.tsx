import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { Activity, ActivityTrait, Anchor } from '../App';

type ActivityMapProps = {
  anchor: Anchor;
  activities: Activity[];
  highlightedTraits: ActivityTrait[];
};

const recenterZoom = 11;
const ragColors = ['#32b64b', '#ffb300', '#ef4444'];

const Recenter = ({ anchor }: { anchor: Anchor }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([anchor.lat, anchor.lng], recenterZoom, { animate: true });
  }, [anchor, map]);

  return null;
};

const renderStars = (rating: number) => {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars).padEnd(5, '☆');
};

const ActivityMap = ({ anchor, activities, highlightedTraits }: ActivityMapProps) => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const hasPathFilter = highlightedTraits.length > 0;

  useEffect(() => {
    setActiveNodeId(null);
  }, [anchor]);

  return (
    <MapContainer
      center={[anchor.lat, anchor.lng]}
      zoom={recenterZoom}
      className="leaflet-map"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        opacity={0}
      />

      <Recenter anchor={anchor} />

      <CircleMarker
        center={[anchor.lat, anchor.lng]}
        radius={10}
        pathOptions={{ color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 1 }}
      />

      {activities.map((activity, index) => {
        const isOpen = activeNodeId === activity.id;
        const markerColor = ragColors[index % ragColors.length];
        const isHighlighted = !hasPathFilter || activity.traits.some((trait) => highlightedTraits.includes(trait));

        return (
          <CircleMarker
            key={activity.id}
            center={[activity.lat, activity.lng]}
            radius={7}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: isHighlighted ? 0.95 : 0.4,
              opacity: isHighlighted ? 1 : 0.45
            }}
            eventHandlers={{
              mouseover: () => setActiveNodeId(activity.id),
              mouseout: () => setActiveNodeId((current) => (current === activity.id ? null : current))
            }}
          >
            {isOpen && (
              <Tooltip direction="bottom" offset={[0, 14]} permanent className="activity-tooltip">
                <div className="popup-card">
                  <button
                    type="button"
                    className="popup-close"
                    aria-label="Close popup"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveNodeId(null);
                    }}
                  >
                    ×
                  </button>

                  <h3>{activity.name}</h3>

                  <div className="popup-details">
                    <span>{activity.address}</span>
                    <a href="#" onClick={(event) => event.preventDefault()}>{activity.website}</a>
                    <span>{activity.phone}</span>

                    <div className="popup-meta-row">
                      <span className="popup-rating">{activity.rating.toFixed(1)} {renderStars(activity.rating)}</span>
                      <span className="popup-distance">{activity.distanceKm.toFixed(1)} km away</span>
                    </div>
                  </div>

                  <p className="popup-experience">{activity.experience}</p>
                  <p className="popup-traits">Traits: {activity.traits.join(', ')}</p>

                  <label className="popup-itinerary">
                    <input type="checkbox" aria-label={`Add ${activity.name} to itinerary`} />
                    <span>Add to itinerary</span>
                  </label>
                </div>
              </Tooltip>
            )}
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default ActivityMap;
