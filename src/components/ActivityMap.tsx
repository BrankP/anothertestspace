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
    map.setView([anchor.lat, anchor.lng], 13, { animate: true });
  }, [anchor, map]);

  return null;
};

const ActivityMap = ({ anchor, activities }: ActivityMapProps) => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  useEffect(() => {
    setActiveNodeId(null);
  }, [anchor]);

  return (
    <MapContainer
      center={[anchor.lat, anchor.lng]}
      zoom={13}
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
            radius={8}
            pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.95 }}
            eventHandlers={{
              mouseover: () => setActiveNodeId(activity.id),
              mouseout: () => setActiveNodeId((previous) => (previous === activity.id ? null : previous)),
              click: () => setActiveNodeId(activity.id)
            }}
          >
            {isOpen && (
              <Tooltip direction="bottom" offset={[0, 12]} permanent className="activity-tooltip">
                <div className="tooltip-card">
                  <input type="checkbox" className="tooltip-check" aria-label={`Save ${activity.name}`} />
                  <strong>{activity.name}</strong>
                  <span>{activity.experience}</span>
                  <span>{activity.distanceKm} km from anchor</span>
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
