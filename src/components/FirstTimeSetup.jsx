import React, { useState } from 'react';
import { Users, UserPlus, Trash2 } from 'lucide-react';

const FirstTimeSetup = ({ onComplete }) => {
  const [members, setMembers] = useState(['']);
  const [setupError, setSetupError] = useState('');

  const addMemberField = () => {
    setMembers([...members, '']);
  };

  const removeMemberField = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = () => {
    const validMembers = members.filter(member => member.trim() !== '');
    
    if (validMembers.length === 0) {
      setSetupError('Veuillez ajouter au moins un membre de famille.');
      return;
    }

    // Vérifier les doublons
    const uniqueMembers = [...new Set(validMembers.map(member => member.trim()))];
    if (uniqueMembers.length !== validMembers.length) {
      setSetupError('Certains noms de membres sont identiques. Veuillez utiliser des noms uniques.');
      return;
    }

    onComplete(uniqueMembers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue dans Budget Familial</h1>
          <p className="text-gray-600">Commençons par ajouter les membres de votre famille</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Membres de la famille
          </label>
          
          {members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={member}
                onChange={(e) => updateMember(index, e.target.value)}
                placeholder={`Membre ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {members.length > 1 && (
                <button
                  onClick={() => removeMemberField(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addMemberField}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter un membre
          </button>

          {setupError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{setupError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Commencer
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Vous pourrez modifier ces informations plus tard dans les paramètres
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeSetup;
