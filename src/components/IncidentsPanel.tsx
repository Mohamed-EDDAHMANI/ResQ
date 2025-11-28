import { AlertTriangle, Clock, Activity, Truck, XCircle } from 'lucide-react';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface Incident {
  id: number | string;
  type: string;
  severity: string;
  status: string;
  address: string;
  lat: number;
  lng: number;
  patient: string;
  assignedAmbulanceId: number | null;
  createdAt: string;
  updatedAt: string;
}

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

interface IncidentsPanelProps {
  incidents: Incident[];
  loading: boolean;
  availableAmbulances: Ambulance[];
  onAssignAmbulance: (incidentId: number, ambulanceId: number) => void;
}

export default function IncidentsPanel({ incidents, loading, availableAmbulances, onAssignAmbulance }: IncidentsPanelProps) {
  const [showAmbulanceDialog, setShowAmbulanceDialog] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAssignClick = (incidentId: number) => {
    setSelectedIncidentId(incidentId);
    setShowAmbulanceDialog(true);
  };

  const handleAmbulanceSelect = (ambulanceId: number) => {
    if (selectedIncidentId) {
      onAssignAmbulance(selectedIncidentId, ambulanceId);
      setShowAmbulanceDialog(false);
      setSelectedIncidentId(null);
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'Critique';
      case 'high': return 'Urgent';
      case 'low': return 'Normal';
      default: return severity;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const activeIncidents = incidents.filter(incident => 
    incident.status === 'pending' || incident.status === 'in_progress'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          Incidents Actifs
        </h3>
      </div>
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <Activity className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        ) : (
          activeIncidents.map((incident) => (
            <div key={incident.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">INC{incident.id.toString().padStart(3, '0')}</span>
                <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(incident.severity)}`}>
                  {getSeverityLabel(incident.severity)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{incident.address}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(incident.createdAt)}
                </span>
                {incident.status === 'pending' ? (
                  <button 
                    onClick={() => handleAssignClick(Number(incident.id))}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Assigner
                  </button>
                ) : (
                  <span className="text-green-600 text-xs font-medium">
                    AMB-{incident.assignedAmbulanceId?.toString().padStart(3, '0')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <Dialog.Root open={showAmbulanceDialog} onOpenChange={setShowAmbulanceDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto z-[10000]">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Ambulances Disponibles
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            <div className="space-y-3">
              {availableAmbulances.map((ambulance) => (
                <button
                  key={ambulance.id}
                  onClick={() => handleAmbulanceSelect(ambulance.id)}
                  className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{ambulance.identifier}</p>
                      <p className="text-sm text-gray-500">Équipement: {ambulance.equipment.join(', ')}</p>
                    </div>
                  </div>
                </button>
              ))}
              {availableAmbulances.length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucune ambulance disponible</p>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}