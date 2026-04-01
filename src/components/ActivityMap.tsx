import { CircleMarker, MapContainer } from 'react-leaflet';
import { TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Activity, Anchor } from '../App';

type ActivityMapProps = {
  anchor: Anchor;
  activities: Activity[];
  onActivityTap: (activity: Activity) => void;
};

const Recenter = ({ anchor }: { anchor: Anchor }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([anchor.lat, anchor.lng], 13, { animate: true });
  }, [anchor, map]);

  return null;
};

const ActivityMap = ({ anchor, activities, onActivityTap }: ActivityMapProps) => {
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
      />

      {activities.map((activity) => (
        <CircleMarker
          key={activity.id}
          center={[activity.lat, activity.lng]}
          radius={8}
          pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.95 }}
          eventHandlers={{
            click: () => onActivityTap(activity)
          }}
        />
      ))}
    </MapContainer>
  );
};

export default ActivityMap;
