import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, BarChart3, Truck } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import CriticalAlert from '../components/CriticalAlert';
import IncidentsPanel from '../components/IncidentsPanel';
import AmbulancesPanel from '../components/AmbulancesPanel';
import { Header } from '../components/Header';
import { AmbulanceMap } from '../components/AmbulanceMap';
import axios from 'axios';

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

interface Crew {
  id: number;
  leader: string;
  members: string[];
}

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  const completedIncidents = incidents.filter(incident => incident.status === 'completed');

  // Fetch data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsRes, ambulancesRes, crewsRes] = await Promise.all([
          axios.get('http://localhost:5000/incidents'),
          axios.get('http://localhost:5000/ambulances'),
          axios.get('http://localhost:5000/crews')
        ]);
        
        setIncidents(incidentsRes.data);
        setAmbulances(ambulancesRes.data);
        setCrews(crewsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeIncidents = incidents.filter(incident => 
    incident.status === 'pending' || incident.status === 'in_progress'
  );

  const availableAmbulances = ambulances.filter(amb => amb.status === 'available');

  const handleIncidentCreated = () => {
    // Refresh incidents data
    const fetchIncidents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/incidents');
        setIncidents(response.data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };
    fetchIncidents();
  };

  return (
    <div className="w-full h-screen bg-gray-50 ">
      <Header onIncidentCreated={handleIncidentCreated} />

      {/* Main Dashboard */}
      <div className="w-full h-[calc(100vh-80px)]">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4 px-0 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ambulances Disponibles</p>
                <p className="text-3xl font-bold text-green-600">{availableAmbulances.length}</p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Incidents Actifs</p>
                <p className="text-3xl font-bold text-orange-600">{activeIncidents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-red-600">{incidents.filter(i => i.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés Aujourd'hui</p>
                <p className="text-3xl font-bold text-blue-600">{incidents.filter(i => i.status === 'completed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 px-0 pb-4 h-[calc(100%-140px)]">
          {/* Map Section */}
          <div className="col-span-8 h-full">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Carte des Ambulances</h2>
              </div>
              <div className="flex-1">
                <AmbulanceMap ambulances={ambulances} crews={crews} />
              </div>
            </div>

            <CriticalAlert />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-4 h-full flex flex-col">
            <IncidentsPanel incidents={incidents} loading={loading} />
            
            <AmbulancesPanel 
              ambulances={ambulances}
              crews={crews}
              loading={loading}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                <Dialog.Root open={showHistory} onOpenChange={setShowHistory}>
                  <Dialog.Trigger asChild>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                      <span>Voir Historique</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-5/6 max-w-6xl max-h-[85vh] overflow-y-auto z-50">
                      <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Historique des Incidents
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button className="text-gray-500 hover:text-gray-700">
                            <XCircle className="w-6 h-6" />
                          </button>
                        </Dialog.Close>
                      </div>
                      <div className="space-y-4">
                        {completedIncidents.map((incident) => (
                          <div key={incident.id} className="p-6 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-6 mb-3">
                                  <span className="font-medium text-gray-900 text-lg">INC{incident.id.toString().padStart(3, '0')}</span>
                                  <span className={`px-3 py-1 text-sm rounded border ${getSeverityColor(incident.severity)}`}>
                                    {incident.severity}
                                  </span>
                                  <span className="text-gray-600">{incident.address}</span>
                                </div>
                                <div className="flex items-center space-x-8 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    Terminé
                                  </span>
                                  <span>Patient: {incident.patient}</span>
                                  <span>Type: {incident.type}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}