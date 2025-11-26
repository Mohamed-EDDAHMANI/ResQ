import { useState } from 'react';
import { Plus, Bell, Settings, LogOut } from 'lucide-react';
import { NewIncidentModal } from './NewIncidentModal';

interface HeaderProps {
  onIncidentCreated: () => void;
}

export function Header({ onIncidentCreated }: HeaderProps) {
  const [showNewIncident, setShowNewIncident] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ResQ Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNewIncident(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvel Incident</span>
            </button>
            
            <NewIncidentModal 
              open={showNewIncident} 
              onOpenChange={setShowNewIncident}
              onIncidentCreated={onIncidentCreated}
            />
            
            <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}