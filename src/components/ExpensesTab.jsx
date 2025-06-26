import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, Calendar, Trash2, Mic, MicOff, HelpCircle, X, Upload, FileText } from 'lucide-react';

const ExpensesTab = ({
  currentData,
  categories,
  newExpense,
  handleExpenseCategoryChange,
  handleExpenseAmountChange,
  handleExpenseDescriptionChange,
  addExpense,
  deleteExpense,
  categorySpending
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setVoiceStatus('');
      };

      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        setVoiceStatus(`Erreur: ${event.error}`);
        setTimeout(() => setVoiceStatus(''), 3000);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        parseVoiceInput(transcript);
      };

      setRecognition(recognitionInstance);
      setVoiceSupported(true);
    } else {
      setVoiceSupported(false);
    }
  }, []);

  // Parser l'entrée vocale
  const parseVoiceInput = (transcript) => {
    setVoiceStatus(`Traitement: "${transcript}"`);

    // Patterns pour extraire les informations
    const patterns = {
      // "épicerie 25 euros courses alimentaires"
      // "restaurant 15 déjeuner"
      // "essence 50 euros carburant"
      full: /^(\w+)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€)?\s*(.*)$/i,
      // "25 euros épicerie courses"
      amountFirst: /^(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€)?\s+(\w+)\s*(.*)$/i
    };

    let category = '';
    let amount = '';
    let description = '';

    // Essayer le pattern principal
    let match = transcript.match(patterns.full);
    if (match) {
      const [, cat, amt, desc] = match;
      category = findBestCategory(cat);
      amount = amt.replace(',', '.');
      description = desc.trim() || cat;
    } else {
      // Essayer le pattern avec montant en premier
      match = transcript.match(patterns.amountFirst);
      if (match) {
        const [, amt, cat, desc] = match;
        category = findBestCategory(cat);
        amount = amt.replace(',', '.');
        description = desc.trim() || cat;
      }
    }

    // Appliquer les valeurs extraites
    if (category && amount) {
      // Simuler les événements de changement
      handleExpenseCategoryChange({ target: { value: category } });
      handleExpenseAmountChange({ target: { value: amount } });
      handleExpenseDescriptionChange({ target: { value: description } });

      setVoiceStatus(`✓ Détecté: ${category} - ${amount}€ - ${description}`);
      setTimeout(() => setVoiceStatus(''), 3000);
    } else {
      setVoiceStatus('❌ Format non reconnu. Essayez: "catégorie montant description"');
      setTimeout(() => setVoiceStatus(''), 4000);
    }
  };

  // Trouver la meilleure catégorie correspondante
  const findBestCategory = (input) => {
    const inputLower = input.toLowerCase();

    // Correspondances directes
    const categoryMappings = {
      'épicerie': 'Épicerie',
      'epicerie': 'Épicerie',
      'courses': 'Épicerie',
      'nourriture': 'Épicerie',
      'alimentation': 'Épicerie',
      'restaurant': 'Restaurant',
      'resto': 'Restaurant',
      'repas': 'Restaurant',
      'déjeuner': 'Restaurant',
      'diner': 'Restaurant',
      'essence': 'Essence',
      'carburant': 'Essence',
      'transport': 'Transport',
      'facture': 'Factures',
      'factures': 'Factures',
      'électricité': 'Factures',
      'eau': 'Factures',
      'internet': 'Factures',
      'divertissement': 'Divertissement',
      'loisir': 'Divertissement',
      'loisirs': 'Divertissement',
      'cinéma': 'Divertissement',
      'shopping': 'Shopping',
      'achat': 'Shopping',
      'vêtement': 'Shopping',
      'vêtements': 'Shopping',
      'santé': 'Santé',
      'médecin': 'Santé',
      'pharmacie': 'Santé',
      'autre': 'Autre',
      'divers': 'Autre'
    };

    // Chercher une correspondance exacte
    if (categoryMappings[inputLower]) {
      return categoryMappings[inputLower];
    }

    // Chercher une correspondance partielle dans les catégories existantes
    const bestMatch = categories.find(cat =>
      cat.toLowerCase().includes(inputLower) ||
      inputLower.includes(cat.toLowerCase())
    );

    return bestMatch || categories[0] || 'Autre';
  };

  // Démarrer/arrêter l'écoute
  const toggleVoiceRecognition = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Composant popup d'aide vocale
  const VoiceHelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Commandes Vocales</h3>
            </div>
            <button
              onClick={() => setShowVoiceHelp(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📝 Format des commandes</h4>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-mono">
                  [Catégorie] [Montant] [euros] [Description]
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">💡 Exemples</h4>
              <div className="space-y-2">
                {[
                  "Épicerie 25 euros courses alimentaires",
                  "Restaurant 15 euros déjeuner avec collègues",
                  "Essence 50 euros carburant",
                  "Factures 80 euros électricité"
                ].map((example, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded border text-sm font-mono text-gray-700">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">🏷️ Catégories reconnues</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { keywords: "épicerie, courses", category: "Épicerie" },
                  { keywords: "restaurant, repas", category: "Restaurant" },
                  { keywords: "essence, carburant", category: "Essence" },
                  { keywords: "facture, électricité", category: "Factures" },
                  { keywords: "shopping, vêtements", category: "Shopping" },
                  { keywords: "santé, médecin", category: "Santé" }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded border">
                    <div className="font-medium text-gray-900">{item.category}</div>
                    <div className="text-gray-600">{item.keywords}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">💡 Conseils</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Parlez clairement et à vitesse normale</li>
                <li>• Utilisez un environnement calme</li>
                <li>• Utilisez des chiffres (25) plutôt que des mots</li>
                <li>• Autorisez l'accès au microphone</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>🔒 Confidentialité :</strong> La reconnaissance vocale se fait localement dans votre navigateur.
                Aucune donnée n'est envoyée à des serveurs externes.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowVoiceHelp(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compris !
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Ajouter une Dépense
          </h3>

          {/* Voice Recognition Buttons */}
          {voiceSupported && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVoiceHelp(true)}
                className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Aide commandes vocales"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Aide</span>
              </button>

              <button
                onClick={toggleVoiceRecognition}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                title={isListening ? 'Cliquez pour arrêter l\'écoute' : 'Commande vocale'}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Arrêter</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="hidden sm:inline">Vocal</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Voice Status */}
        {voiceStatus && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            voiceStatus.includes('✓')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : voiceStatus.includes('❌')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {voiceStatus}
          </div>
        )}

        {/* Message si reconnaissance vocale non supportée */}
        {!voiceSupported && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              <strong>ℹ️ Info :</strong> La reconnaissance vocale n'est pas supportée par votre navigateur.
              Utilisez Chrome, Edge ou Safari pour cette fonctionnalité.
            </p>
          </div>
        )}

        {/* Recording Animation Overlay - Cliquable pour arrêter */}
        {isListening && (
          <button
            onClick={toggleVoiceRecognition}
            className="mb-4 w-full p-4 bg-red-50 rounded-lg border-2 border-red-200 border-dashed animate-pulse hover:bg-red-100 transition-colors cursor-pointer"
            title="Cliquez pour arrêter l'enregistrement"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <Mic className="w-8 h-8 text-red-600" />
                <div className="absolute -inset-3 border-2 border-red-300 rounded-full animate-ping"></div>
                <div className="absolute -inset-1 border border-red-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-center">
                <p className="text-red-700 font-bold text-lg">🎤 Enregistrement en cours...</p>
                <p className="text-red-600 text-sm">Dites par exemple: "Épicerie 25 dollars courses hebdomadaires"</p>
              </div>
              <div className="flex gap-1 items-end">
                <div className="w-2 h-8 bg-red-500 rounded animate-pulse"></div>
                <div className="w-2 h-6 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-10 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-4 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-7 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-2 h-9 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-5 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newExpense.category}
            onChange={handleExpenseCategoryChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Montant"
            value={newExpense.amount}
            onChange={handleExpenseAmountChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={handleExpenseDescriptionChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addExpense}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dépenses par Catégorie</h3>
        <div className="space-y-3">
          {categories.map(category => {
            const spent = categorySpending[category] || 0;
            const budget = currentData.budgets[category];
            const percentage = (spent / budget) * 100;
            const isOverBudget = spent > budget;

            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    ${spent.toFixed(2)} / ${budget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-xs text-red-600">
                    Dépassement de ${(spent - budget).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dépenses Récentes</h3>
        <div className="space-y-3">
          {currentData.expenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {expense.date}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {expense.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  ${expense.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {currentData.expenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune dépense enregistrée</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup d'aide vocale */}
      {showVoiceHelp && <VoiceHelpModal />}
    </div>
  );
};

export default ExpensesTab;
