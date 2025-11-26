import { Filter, MapPin, Activity, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';

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

interface AmbulancesPanelProps {
  ambulances: Ambulance[];
  crews: Crew[];
  loading: boolean;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

export default function AmbulancesPanel({ 
  ambulances, 
  crews, 
  loading, 
  selectedFilter, 
  onFilterChange 
}: AmbulancesPanelProps) {
  
  const getCrewLeader = (crewId: number | null) => {
    if (!crewId) return 'Non assigné';
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.leader : 'Non assigné';
  };

  const getAmbulanceStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'Disponible';
      case 'on_mission': return 'En mission';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getAmbulanceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_mission': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAmbulances = selectedFilter === 'all' 
    ? ambulances 
    : ambulances.filter(amb => {
        const statusLabel = getAmbulanceStatusLabel(amb.status).toLowerCase();
        return statusLabel.includes(selectedFilter.toLowerCase());
      });

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Ambulances</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select.Root value={selectedFilter} onValueChange={onFilterChange}>
              <Select.Trigger className="text-sm border border-gray-300 rounded px-2 py-1 flex items-center space-x-1">
                <Select.Value />
                <Select.Icon>
                  <ChevronDown className="w-3 h-3" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white border border-gray-300 rounded shadow-lg z-50">
                  <Select.Viewport className="p-1">
                    <Select.Item value="all" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                      <Select.ItemText>Toutes</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="disponible" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                      <Select.ItemText>Disponibles</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="mission" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                      <Select.ItemText>En Mission</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="maintenance" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                      <Select.ItemText>Maintenance</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <Activity className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        ) : (
          filteredAmbulances.map((ambulance) => (
            <div key={ambulance.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{ambulance.identifier}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getAmbulanceStatusColor(ambulance.status)}`}>
                  {getAmbulanceStatusLabel(ambulance.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{getCrewLeader(ambulance.crewId)}</p>
              <p className="text-xs text-gray-500 flex items-center mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {ambulance.lat.toFixed(4)}, {ambulance.lng.toFixed(4)}
              </p>
              <button className="w-full text-xs bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 transition-colors">
                Modifier Statut
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}