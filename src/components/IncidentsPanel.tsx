import { AlertTriangle, Clock, Activity } from 'lucide-react';

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

interface IncidentsPanelProps {
  incidents: Incident[];
  loading: boolean;
}

export default function IncidentsPanel({ incidents, loading }: IncidentsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
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
    </div>
  );
}