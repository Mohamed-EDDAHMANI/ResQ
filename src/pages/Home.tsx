import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Activity,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Filter,
  Users,
  Truck,
  ChevronDown
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import CriticalAlert from '../components/CriticalAlert';

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mock data
  const ambulances = [
    { id: 'AMB001', status: 'Disponible', location: 'Rue Mohammed V', driver: 'Ahmed Benali', lat: 33.5731, lng: -7.5898 },
    { id: 'AMB002', status: 'Occupé', location: 'Avenue Hassan II', driver: 'Fatima Zahra', lat: 33.5831, lng: -7.5998 },
    { id: 'AMB003', status: 'Disponible', location: 'Boulevard Zerktouni', driver: 'Omar Alami', lat: 33.5631, lng: -7.5798 },
    { id: 'AMB004', status: 'Pause', location: 'Quartier Maarif', driver: 'Aicha Bennani', lat: 33.5931, lng: -7.6098 },
    { id: 'AMB005', status: 'Disponible', location: 'Hay Riad', driver: 'Youssef Tazi', lat: 33.5531, lng: -7.5698 },
    { id: 'AMB006', status: 'Occupé', location: 'Agdal', driver: 'Khadija Alaoui', lat: 33.5431, lng: -7.5598 },
  ];

  const incidents = [
    { id: 'INC001', address: '123 Rue Allal Ben Abdellah', severity: 'Critique', status: 'En attente', time: '14:30', assignedTo: null },
    { id: 'INC002', address: '45 Avenue Mohammed VI', severity: 'Urgent', status: 'Assigné', time: '14:15', assignedTo: 'AMB001' },
    { id: 'INC003', address: '78 Boulevard Anfa', severity: 'Normal', status: 'En cours', time: '13:45', assignedTo: 'AMB002' },
    { id: 'INC004', address: '90 Rue Ibn Sina', severity: 'Urgent', status: 'En attente', time: '14:45', assignedTo: null },
  ];

  const completedIncidents = [
    { id: 'INC005', address: '12 Rue Ibn Battuta', severity: 'Urgent', completedAt: '13:30', duration: '25 min', ambulance: 'AMB003' },
    { id: 'INC006', address: '67 Avenue Lalla Yacout', severity: 'Normal', completedAt: '12:15', duration: '18 min', ambulance: 'AMB001' },
    { id: 'INC007', address: '89 Rue Al Massira', severity: 'Critique', completedAt: '11:45', duration: '32 min', ambulance: 'AMB002' },
  ];

  const filteredAmbulances = selectedFilter === 'all' 
    ? ambulances 
    : ambulances.filter(amb => amb.status.toLowerCase() === selectedFilter.toLowerCase());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'Urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Occupé': return 'bg-red-100 text-red-800';
      case 'Pause': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 ">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <Activity className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">ResQ - Centre de Régulation</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Dialog.Root open={showNewIncident} onOpenChange={setShowNewIncident}>
                <Dialog.Trigger asChild>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Nouvel Incident</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-[500px] z-50">
                    <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
                      Créer Nouvel Incident
                    </Dialog.Title>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Entrez l'adresse complète..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de Gravité</label>
                        <Select.Root>
                          <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center justify-between">
                            <Select.Value placeholder="Sélectionner..." />
                            <Select.Icon>
                              <ChevronDown className="w-4 h-4" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                              <Select.Viewport className="p-1">
                                <Select.Item value="normal" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                  <Select.ItemText>Normal</Select.ItemText>
                                </Select.Item>
                                <Select.Item value="urgent" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                  <Select.ItemText>Urgent</Select.ItemText>
                                </Select.Item>
                                <Select.Item value="critique" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                  <Select.ItemText>Critique</Select.ItemText>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows={4}
                          placeholder="Description détaillée de l'incident..."
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-8">
                      <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                        Créer Incident
                      </button>
                      <Dialog.Close asChild>
                        <button className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                          Annuler
                        </button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              
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

      {/* Main Dashboard */}
      <div className="w-full h-[calc(100vh-80px)]">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4 px-0 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ambulances Disponibles</p>
                <p className="text-3xl font-bold text-green-600">{ambulances.filter(a => a.status === 'Disponible').length}</p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Incidents Actifs</p>
                <p className="text-3xl font-bold text-orange-600">{incidents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-red-600">{incidents.filter(i => i.status === 'En attente').length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés Aujourd'hui</p>
                <p className="text-3xl font-bold text-blue-600">{completedIncidents.length}</p>
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
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Carte Interactive</p>
                  <p className="text-gray-500">Positions en temps réel des ambulances</p>
                </div>
              </div>
            </div>

            <CriticalAlert />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-4 h-full flex flex-col">
            {/* Incidents Panel */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Incidents Actifs
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{incident.id}</span>
                      <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{incident.address}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {incident.time}
                      </span>
                      {incident.status === 'En attente' ? (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                          Assigner
                        </button>
                      ) : (
                        <span className="text-green-600 text-xs font-medium">
                          {incident.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambulances Panel */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Ambulances</h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select.Root value={selectedFilter} onValueChange={setSelectedFilter}>
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
                            <Select.Item value="occupé" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                              <Select.ItemText>Occupées</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="pause" className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm">
                              <Select.ItemText>En Pause</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {filteredAmbulances.map((ambulance) => (
                  <div key={ambulance.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{ambulance.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ambulance.status)}`}>
                        {ambulance.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{ambulance.driver}</p>
                    <p className="text-xs text-gray-500 flex items-center mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {ambulance.location}
                    </p>
                    <button className="w-full text-xs bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 transition-colors">
                      Modifier Statut
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                                  <span className="font-medium text-gray-900 text-lg">{incident.id}</span>
                                  <span className={`px-3 py-1 text-sm rounded border ${getSeverityColor(incident.severity)}`}>
                                    {incident.severity}
                                  </span>
                                  <span className="text-gray-600">{incident.address}</span>
                                </div>
                                <div className="flex items-center space-x-8 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    Terminé à {incident.completedAt}
                                  </span>
                                  <span>Durée: {incident.duration}</span>
                                  <span>Ambulance: {incident.ambulance}</span>
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