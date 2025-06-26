import React, { useState } from 'react';
import { Settings, UserPlus, UserMinus, Edit2, Check, X, AlertTriangle, Trash2, DollarSign } from 'lucide-react';

const SettingsTab = ({ 
  familyMembers, 
  addMember, 
  deleteMember, 
  editingMember, 
  setEditingMember, 
  tempMemberName, 
  setTempMemberName, 
  saveEditMember, 
  resetAllData, 
  exportData 
}) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    if (familyMembers.includes(newMemberName.trim())) {
      alert('Ce membre existe déjà !');
      return;
    }
    
    addMember(newMemberName.trim());
    setNewMemberName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Paramètres de l'Application
        </h3>
        
        {/* Gestion des membres */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Membres de la Famille</h4>
          
          {/* Ajouter un membre */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom du membre"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddMember}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
          
          {/* Liste des membres */}
          <div className="space-y-2">
            {familyMembers.map(member => (
              <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {editingMember === member ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempMemberName}
                        onChange={(e) => setTempMemberName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditMember()}
                        className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                      <button onClick={saveEditMember} className="text-green-600 hover:text-green-700">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingMember(null)} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{member}</span>
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setTempMemberName(member);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => deleteMember(member)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={familyMembers.length <= 1}
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section de gestion des données */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Gestion des Données
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">Sauvegarde Automatique</h4>
            <p className="text-sm text-orange-700 mb-3">
              Vos données sont automatiquement sauvegardées localement dans votre navigateur. 
              Elles persistent entre les sessions.
            </p>
            <button
              onClick={exportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Exporter les Données
            </button>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Zone de Danger</h4>
            <p className="text-sm text-red-700 mb-3">
              Effacer toutes les données supprimera définitivement tous vos membres de famille, 
              dépenses, budgets et paramètres.
            </p>
            <button
              onClick={resetAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Effacer Toutes les Données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
