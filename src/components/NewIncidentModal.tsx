interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewIncidentModal({ isOpen, onClose }: NewIncidentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[500px]">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Créer Nouvel Incident</h3>
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
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>Normal</option>
              <option>Urgent</option>
              <option>Critique</option>
            </select>
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
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}