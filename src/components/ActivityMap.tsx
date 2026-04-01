import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { Activity, Anchor } from '../App';

type ActivityMapProps = {
  anchor: Anchor;
  activities: Activity[];
};

const Recenter = ({ anchor }: { anchor: Anchor }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([anchor.lat, anchor.lng], 11, { animate: true });
  }, [anchor, map]);

  return null;
};

const renderStars = (rating: number) => {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars).padEnd(5, '☆');
};

const ActivityMap = ({ anchor, activities }: ActivityMapProps) => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  useEffect(() => {
    setActiveNodeId(null);
  }, [anchor]);

  return (
    <MapContainer
      center={[anchor.lat, anchor.lng]}
      zoom={11}
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
      >
        <Tooltip direction="bottom" offset={[0, 10]} permanent>
          <div className="anchor-tag">{anchor.name} Anchor</div>
        </Tooltip>
      </CircleMarker>

      {activities.map((activity) => {
        const isOpen = activeNodeId === activity.id;

        return (
          <CircleMarker
            key={activity.id}
            center={[activity.lat, activity.lng]}
            radius={7}
            pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.95 }}
            eventHandlers={{
              mouseover: () => setActiveNodeId(activity.id),
              click: () => setActiveNodeId(activity.id)
            }}
          >
            {isOpen && (
              <Tooltip direction="bottom" offset={[0, 14]} permanent className="activity-tooltip">
                <div className="popup-card" onMouseLeave={() => setActiveNodeId(null)}>
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
                    <strong>Details from Google Maps</strong>
                    <span>{activity.address}</span>
                    <a href="#" onClick={(event) => event.preventDefault()}>{activity.website}</a>
                    <span>{activity.phone}</span>

                    <div className="popup-meta-row">
                      <span className="popup-rating">{activity.rating.toFixed(1)} {renderStars(activity.rating)}</span>
                      <span className="popup-distance">{activity.distanceKm.toFixed(1)} km away</span>
                      <a href="#" onClick={(event) => event.preventDefault()}>View in Google Maps</a>
                    </div>
                  </div>

                  <label className="popup-itinerary">
                    <input type="checkbox" aria-label={`Add ${activity.name} to itinerary`} />
                    <span>Add to itinerary</span>
                  </label>

                  <p className="popup-experience">{activity.experience}</p>
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
