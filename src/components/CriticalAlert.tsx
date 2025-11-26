import { AlertTriangle } from 'lucide-react';

export default function CriticalAlert() {
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