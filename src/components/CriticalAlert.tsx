import { AlertTriangle } from 'lucide-react';

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

interface CriticalAlertProps {
  incidents: Incident[];
}

export default function CriticalAlert({ incidents }: CriticalAlertProps) {
  const criticalPendingIncidents = incidents.filter(
    incident => incident.severity === 'critical' && incident.status === 'pending'
  );

  if (criticalPendingIncidents.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse z-10">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-semibold text-lg">ALERTE - INCIDENT CRITIQUE</h3>
          <p className="text-sm">Nouvel incident critique nécessitant une intervention immédiate</p>
        </div>
      </div>
    </div>
  );
}