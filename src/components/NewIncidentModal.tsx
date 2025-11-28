import { useState } from 'react';
import { XCircle, MapPin } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface NewIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncidentCreated: () => void;
}

interface FormData {
  type: string;
  severity: string;
  address: string;
  patient: string;
  lat: number | null;
  lng: number | null;
}

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export function NewIncidentModal({ open, onOpenChange, onIncidentCreated }: NewIncidentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    severity: '',
    address: '',
    patient: '',
    lat: null,
    lng: null
  });
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.severity || !formData.address || !formData.patient || !formData.lat || !formData.lng) {
      alert('Veuillez remplir tous les champs et sélectionner une localisation');
      return;
    }

    setLoading(true);
    try {
      // Get existing incidents to determine next ID
      const existingIncidents = await axios.get('http://localhost:5000/incidents');
      const maxId = Math.max(...existingIncidents.data.map((inc: any) => typeof inc.id === 'number' ? inc.id : 0));
      const nextId = maxId + 1;

      await axios.post('http://localhost:5000/incidents', {
        id: nextId,
        type: formData.type,
        severity: formData.severity,
        status: 'pending',
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        patient: formData.patient,
        assignedAmbulanceId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setFormData({ type: '', severity: '', address: '', patient: '', lat: null, lng: null });
      onIncidentCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Erreur lors de la création de l\'incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto z-[10000]">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Créer un Nouvel Incident
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'Incident</label>
                <Select.Root value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
                    <Select.Value placeholder="Sélectionner le type..." />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg z-[10001]">
                      <Select.Viewport className="p-2">
                        <Select.Item value="Accident de la route" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Accident de la route</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Urgence médicale" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Urgence médicale</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Incendie" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Incendie</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Agression" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Agression</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de Gravité</label>
                <Select.Root value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
                    <Select.Value placeholder="Sélectionner la gravité..." />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg z-[10001]">
                      <Select.Viewport className="p-2">
                        <Select.Item value="low" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Faible</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="medium" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Moyenne</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="high" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Élevée</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="critical" className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                          <Select.ItemText>Critique</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Adresse complète de l'incident..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
              <input 
                type="text" 
                value={formData.patient}
                onChange={(e) => setFormData(prev => ({ ...prev, patient: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Homme, 45 ans"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localisation (Cliquez sur la carte)
              </label>
              <div className="h-64 border border-gray-300 rounded-lg overflow-hidden">
                <MapContainer
                  center={[33.5731, -7.5898]} // Casablanca center
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              {formData.lat && formData.lng && (
                <p className="text-sm text-green-600 mt-2">
                  Localisation sélectionnée: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                </p>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer Incident'}
              </button>
              <Dialog.Close asChild>
                <button type="button" className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                  Annuler
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}