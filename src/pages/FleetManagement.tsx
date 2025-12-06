import { useState, useEffect } from 'react';
import { Truck, Plus, Settings, AlertTriangle, CheckCircle, Wrench, XCircle, LogOut } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { clearCurrentUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

interface FleetVehicle {
  id: string;
  identifier: string;
  status: string;
  model: string;
  year: number;
  mileage: number;
}

interface Ambulance {
  id: string;
  identifier: string;
  status: string;
  lat: number;
  lng: number;
  crewId: number | null;
  equipment: string[];
  lastUpdate: string;
}

export default function FleetManagement() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    identifier: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fleetRes, ambulancesRes] = await Promise.all([
        axios.get('http://localhost:5000/fleet'),
        axios.get('http://localhost:5000/ambulances')
      ]);
      setFleet(fleetRes.data);
      setAmbulances(ambulancesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_service': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'hors_service': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_service': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'hors_service': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const updateVehicleStatus = async (vehicleId: string, newStatus: string) => {
    const vehicle = fleet.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const originalStatus = vehicle.status;

    try {
      // Update local state immediately
      setFleet(prev => prev.map(v => 
        v.id === vehicleId ? { ...v, status: newStatus } : v
      ));

      // Update server in background
      await axios.put(`http://localhost:5000/fleet/${vehicleId}`, {
        ...vehicle,
        status: newStatus
      });

      console.log('Vehicle status updated successfully');
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      // Revert local state on error
      setFleet(prev => prev.map(v => 
        v.id === vehicleId ? { ...v, status: originalStatus } : v
      ));
    }
  };

  const addVehicle = async () => {
    try {
      const newId = (Math.max(...fleet.map(v => parseInt(v.id))) + 1).toString();
      const vehicleData = {
        id: newId,
        ...newVehicle,
        status: 'en_service'
      };

      await axios.post('http://localhost:5000/fleet', vehicleData);
      
      // Also add to ambulances collection
      const ambulanceData = {
        id: newId,
        identifier: newVehicle.identifier,
        status: 'available',
        lat: 33.589886,
        lng: -7.603869,
        crewId: null,
        equipment: [],
        lastUpdate: new Date().toISOString()
      };

      await axios.post('http://localhost:5000/ambulances', ambulanceData);

      fetchData();
      setShowAddDialog(false);
      setNewVehicle({ identifier: '', model: '', year: new Date().getFullYear(), mileage: 0 });
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const removeVehicle = async (vehicleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce véhicule de la flotte?')) return;

    try {
      await Promise.all([
        axios.delete(`http://localhost:5000/fleet/${vehicleId}`),
        axios.delete(`http://localhost:5000/ambulances/${vehicleId}`)
      ]);
      fetchData();
    } catch (error) {
      console.error('Error removing vehicle:', error);
    }
  };

  const stats = {
    total: fleet.length,
    enService: fleet.filter(v => v.status === 'en_service').length,
    maintenance: fleet.filter(v => v.status === 'maintenance').length,
    horsService: fleet.filter(v => v.status === 'hors_service').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de la Flotte</h1>
            <p className="text-gray-600">Gérez l'état et la disponibilité des véhicules</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Véhicules</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Service</p>
                <p className="text-3xl font-bold text-green-600">{stats.enService}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-3xl font-bold text-orange-600">{stats.maintenance}</p>
              </div>
              <Wrench className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hors Service</p>
                <p className="text-3xl font-bold text-red-600">{stats.horsService}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Fleet Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">État de la Flotte</h2>
            <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
              <Dialog.Trigger asChild>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Véhicule</span>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 z-[10000]">
                  <Dialog.Title className="text-lg font-semibold mb-4">Ajouter un Véhicule</Dialog.Title>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Identifiant (ex: AMB-004)"
                      value={newVehicle.identifier}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, identifier: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Modèle (ex: Mercedes Sprinter)"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Année"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Kilométrage"
                      value={newVehicle.mileage}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={addVehicle}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                    <Dialog.Close asChild>
                      <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                        Annuler
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modèle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kilométrage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fleet.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{vehicle.identifier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(vehicle.status)}
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status === 'en_service' ? 'En Service' : 
                           vehicle.status === 'maintenance' ? 'Maintenance' : 'Hors Service'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{vehicle.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{vehicle.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{vehicle.mileage.toLocaleString()} km</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <select
                          value={vehicle.status}
                          onChange={(e) => updateVehicleStatus(vehicle.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="en_service">En Service</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="hors_service">Hors Service</option>
                        </select>
                        <button
                          onClick={() => removeVehicle(vehicle.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}