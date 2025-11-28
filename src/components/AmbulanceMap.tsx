import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ambulance icons based on status
const createAmbulanceIcon = (status: string) => {
  const color = status === 'available' ? '#10b981' : status === 'on_mission' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-ambulance-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

interface Ambulance {
  id: number;
  identifier: string;
  status: string;
  lat: number;
  lng: number;
  crewId: number | null;
  equipment: string[];
  lastUpdate: string;
}

interface Crew {
  id: number;
  leader: string;
  members: string[];
}

interface AmbulanceMapProps {
  ambulances: Ambulance[];
  crews: Crew[];
}

export function AmbulanceMap({ ambulances, crews }: AmbulanceMapProps) {
  const getCrewLeader = (crewId: number | null) => {
    if (!crewId) return 'Aucun équipage';
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.leader : 'Équipage inconnu';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'on_mission': return 'En mission';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  return (
    <MapContainer
      center={[33.5731, -7.5898]} // Casablanca center
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {ambulances.map((ambulance) => (
        <Marker
          key={ambulance.id}
          position={[ambulance.lat, ambulance.lng]}
          icon={createAmbulanceIcon(ambulance.status)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-lg">{ambulance.identifier}</h3>
              <p className="text-sm text-gray-600">Statut: {getStatusText(ambulance.status)}</p>
              <p className="text-sm text-gray-600">Chef d'équipe: {getCrewLeader(ambulance.crewId)}</p>
              <p className="text-sm text-gray-600">Équipements: {ambulance.equipment.join(', ') || 'Aucun'}</p>
              <p className="text-xs text-gray-500 mt-1">Dernière mise à jour: {new Date(ambulance.lastUpdate).toLocaleTimeString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}