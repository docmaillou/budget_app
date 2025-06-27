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
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

    // Patterns pour extraire les informations - Support dollars canadiens
    const patterns = {
      // "épicerie 25 dollars courses alimentaires"
      // "restaurant 15 piastres déjeuner"
      // "essence 50 dollars carburant"
      full: /^(\w+)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:dollars?|piastres?|euros?|€|\$)?\s*(.*)$/i,
      // "25 dollars épicerie courses"
      // "25 piastres restaurant déjeuner"
      amountFirst: /^(\d+(?:[.,]\d{1,2})?)\s*(?:dollars?|piastres?|euros?|€|\$)?\s+(\w+)\s*(.*)$/i
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

      setVoiceStatus(`✓ Détecté: ${category} - ${amount}$ - ${description}`);
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

  // Fonction de catégorisation intelligente pour Desjardins
  const categorizeDesjardinsTransaction = (description) => {
    const desc = description.toLowerCase();

    // Épicerie et alimentation
    if (desc.includes('metro') || desc.includes('iga') || desc.includes('provigo') ||
        desc.includes('loblaws') || desc.includes('maxi') || desc.includes('super c') ||
        desc.includes('costco') || desc.includes('walmart') || desc.includes('epicerie')) {
      return 'Épicerie';
    }

    // Restaurants et fast-food
    if (desc.includes('mcdonald') || desc.includes('tim hortons') || desc.includes('subway') ||
        desc.includes('restaurant') || desc.includes('resto') || desc.includes('pizza') ||
        desc.includes('burger') || desc.includes('cafe') || desc.includes('bistro')) {
      return 'Restaurants';
    }

    // Essence et transport
    if (desc.includes('shell') || desc.includes('esso') || desc.includes('petro-canada') ||
        desc.includes('ultramar') || desc.includes('station') || desc.includes('essence') ||
        desc.includes('stm') || desc.includes('opus') || desc.includes('transport')) {
      return 'Essence';
    }

    // Pharmacie et santé
    if (desc.includes('pharmacie') || desc.includes('uniprix') || desc.includes('jean coutu') ||
        desc.includes('pharmaprix') || desc.includes('medical') || desc.includes('dentiste') ||
        desc.includes('clinique') || desc.includes('hopital')) {
      return 'Santé';
    }

    // Factures et services
    if (desc.includes('hydro') || desc.includes('bell') || desc.includes('videotron') ||
        desc.includes('rogers') || desc.includes('telus') || desc.includes('internet') ||
        desc.includes('electricite') || desc.includes('gaz') || desc.includes('assurance') ||
        desc.includes('virement interac') || desc.includes('paiement facture')) {
      return 'Factures';
    }

    // Divertissement
    if (desc.includes('cinema') || desc.includes('theatre') || desc.includes('netflix') ||
        desc.includes('spotify') || desc.includes('jeux') || desc.includes('loisir') ||
        desc.includes('sport') || desc.includes('gym')) {
      return 'Divertissement';
    }

    // Vêtements
    if (desc.includes('vetement') || desc.includes('mode') || desc.includes('boutique') ||
        desc.includes('magasin') || desc.includes('zara') || desc.includes('h&m') ||
        desc.includes('winners') || desc.includes('reitmans')) {
      return 'Vêtements';
    }

    // Retrait ou dépôt
    if (desc.includes('retrait') || desc.includes('depot') || desc.includes('guichet') ||
        desc.includes('atm') || desc.includes('virement')) {
      return 'Autre';
    }

    return 'Autre';
  };

  // Fonction pour parser le texte d'un relevé Desjardins
  const parseDesjardinsStatement = (text) => {
    console.log('🔍 Début du parsing du relevé Desjardins');
    const transactions = [];
    const lines = text.split('\n');
    console.log(`📄 Nombre de lignes à analyser: ${lines.length}`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.length > 10) { // Ignorer les lignes trop courtes
        console.log(`🔍 Ligne ${i + 1}: "${line}"`);
      }

      // Rechercher les lignes qui correspondent au format des transactions
      // Format typique: "DD JAN CODE Description ... Montant"
      const transactionMatch = line.match(/^(\d{1,2})\s+(JAN|FEV|MAR|AVR|MAI|JUN|JUL|AOU|SEP|OCT|NOV|DEC)\s+(\w+)\s+(.+?)\s+(\d+[,\.]\d{2})$/i);

      if (transactionMatch) {
        console.log('✅ Match trouvé:', transactionMatch);
        const [, day, month, code, description, amount] = transactionMatch;

        // Convertir le mois en numéro
        const monthMap = {
          'JAN': '01', 'FEV': '02', 'MAR': '03', 'AVR': '04',
          'MAI': '05', 'JUN': '06', 'JUL': '07', 'AOU': '08',
          'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        };

        const currentYear = new Date().getFullYear();
        const date = `${currentYear}-${monthMap[month.toUpperCase()]}-${day.padStart(2, '0')}`;
        const amountNum = parseFloat(amount.replace(',', '.'));

        console.log(`📅 Date: ${date}, 💰 Montant: ${amountNum}, 📝 Description: ${description}`);

        // Ignorer les dépôts et virements entrants (montants positifs dans certains contextes)
        if (amountNum > 0 && !description.toLowerCase().includes('depot') &&
            !description.toLowerCase().includes('virement interac')) {

          const category = categorizeDesjardinsTransaction(description);
          console.log(`🏷️ Catégorie assignée: ${category}`);

          const transaction = {
            date: date,
            category: category,
            amount: amountNum,
            description: description.trim()
          };

          transactions.push(transaction);
          console.log('➕ Transaction ajoutée:', transaction);
        } else {
          console.log('⏭️ Transaction ignorée (dépôt ou virement entrant)');
        }
      } else if (line.length > 10) {
        console.log('❌ Pas de match pour cette ligne');
      }
    }

    console.log(`📊 Total des transactions parsées: ${transactions.length}`);
    return transactions;
  };

  // Fonction pour traiter l'upload de fichier
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('🔄 Début de l\'import du fichier:', file.name);
    console.log('📊 Données actuelles avant import:', currentData);
    console.log('🔧 Fonction addExpense disponible:', typeof addExpense);

    setIsProcessing(true);
    setImportStatus('Traitement du fichier en cours...');

    try {
      let text = '';

      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Fichier texte
        text = await file.text();
        console.log('📄 Contenu du fichier lu:', text.substring(0, 200) + '...');
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setImportStatus('❌ Les fichiers PDF ne sont pas encore supportés. Veuillez convertir en texte ou utiliser une image.');
        setIsProcessing(false);
        return;
      } else if (file.type.startsWith('image/')) {
        setImportStatus('❌ L\'OCR pour les images n\'est pas encore implémenté. Veuillez convertir en texte.');
        setIsProcessing(false);
        return;
      } else {
        setImportStatus('❌ Format de fichier non supporté. Utilisez un fichier texte (.txt).');
        setIsProcessing(false);
        return;
      }

      // Parser les transactions
      console.log('🔍 Début du parsing des transactions...');
      const transactions = parseDesjardinsStatement(text);
      console.log('📋 Transactions parsées:', transactions);

      if (transactions.length === 0) {
        console.log('❌ Aucune transaction trouvée dans le fichier');
        setImportStatus('❌ Aucune transaction trouvée. Vérifiez le format du fichier.');
        setIsProcessing(false);
        return;
      }

      console.log(`✅ ${transactions.length} transactions trouvées`);

      // Ajouter les transactions à l'application
      let addedCount = 0;
      for (const transaction of transactions) {
        console.log('🔄 Traitement de la transaction:', transaction);

        // Vérifier si la transaction existe déjà (éviter les doublons)
        const exists = currentData.expenses.some(expense =>
          expense.date === transaction.date &&
          expense.amount === transaction.amount &&
          expense.description === transaction.description
        );

        console.log('🔍 Transaction existe déjà?', exists);

        if (!exists) {
          // Créer un objet expense avec un ID unique
          const newExpense = {
            id: Date.now() + Math.random(), // ID unique
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date
          };

          console.log('➕ Ajout de la nouvelle dépense:', newExpense);

          // Ajouter directement via la fonction addExpense modifiée
          try {
            const expenseToAdd = {
              id: Date.now() + Math.random(), // ID unique
              category: transaction.category,
              amount: transaction.amount,
              description: transaction.description,
              date: transaction.date
            };

            console.log('➕ Ajout de la nouvelle dépense:', expenseToAdd);
            addExpense(expenseToAdd);
            addedCount++;
            console.log('✅ Dépense ajoutée avec succès');
          } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de la dépense:', error);
          }
        } else {
          console.log('⏭️ Transaction ignorée (doublon)');
        }
      }

      console.log(`📊 Import terminé: ${addedCount} ajoutées, ${transactions.length - addedCount} doublons`);
      console.log('📊 Données après import:', currentData);

      setImportStatus(`✅ Import terminé ! ${addedCount} transactions ajoutées (${transactions.length - addedCount} doublons ignorés).`);

      // Réinitialiser le formulaire
      handleExpenseCategoryChange({ target: { value: categories[0] } });
      handleExpenseAmountChange({ target: { value: '' } });
      handleExpenseDescriptionChange({ target: { value: '' } });

    } catch (error) {
      console.error('❌ Erreur lors de l\'import:', error);
      setImportStatus('❌ Erreur lors du traitement du fichier.');
    }

    setIsProcessing(false);
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
                  [Catégorie] [Montant] [dollars/piastres] [Description]
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">💡 Exemples</h4>
              <div className="space-y-2">
                {[
                  "Épicerie 25 dollars courses alimentaires",
                  "Restaurant 15 piastres déjeuner avec collègues",
                  "Essence 50 dollars carburant",
                  "Factures 80 dollars électricité"
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

          {/* Import and Voice Recognition Buttons */}
          <div className="flex items-center gap-2">
            {/* Import Bank Statement Button */}
            <div className="relative">
              <input
                type="file"
                id="bankStatementUpload"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="bankStatementUpload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isProcessing
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title="Importer un relevé bancaire Desjardins"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isProcessing ? 'Traitement...' : 'Import Relevé'}
                </span>
              </label>
            </div>

            {/* Import Help Button */}
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Aide pour l'import de relevés"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Guide</span>
            </button>

            {/* Voice Recognition Buttons */}
            {voiceSupported && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Import Status */}
        {importStatus && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            importStatus.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : importStatus.includes('❌')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {importStatus}
          </div>
        )}

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

      {/* Modal d'aide import */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  📄 Guide d'Import de Relevés Desjardins
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Formats Supportés</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Fichiers texte (.txt)</strong> - Recommandé</li>
                    <li>• <strong>PDF (.pdf)</strong> - En développement</li>
                    <li>• <strong>Images (.png, .jpg)</strong> - En développement</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Comment Préparer Votre Relevé</h4>
                  <ol className="text-sm text-blue-700 space-y-2">
                    <li><strong>1.</strong> Connectez-vous à AccèsD Desjardins</li>
                    <li><strong>2.</strong> Allez dans "Comptes" → "Relevés"</li>
                    <li><strong>3.</strong> Sélectionnez votre période</li>
                    <li><strong>4.</strong> Copiez le texte du relevé dans un fichier .txt</li>
                    <li><strong>5.</strong> Sauvegardez le fichier sur votre ordinateur</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">🎯 Catégorisation Automatique</h4>
                  <div className="text-sm text-yellow-700 grid grid-cols-2 gap-2">
                    <div>
                      <strong>Épicerie:</strong> Metro, IGA, Provigo, Costco
                    </div>
                    <div>
                      <strong>Restaurants:</strong> McDonald's, Tim Hortons
                    </div>
                    <div>
                      <strong>Essence:</strong> Shell, Esso, Petro-Canada
                    </div>
                    <div>
                      <strong>Factures:</strong> Hydro, Bell, Videotron
                    </div>
                    <div>
                      <strong>Santé:</strong> Pharmacie, Uniprix
                    </div>
                    <div>
                      <strong>Divertissement:</strong> Cinéma, Netflix
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">⚙️ Fonctionnalités</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Détection automatique</strong> des transactions</li>
                    <li>• <strong>Évitement des doublons</strong> - Les transactions existantes sont ignorées</li>
                    <li>• <strong>Catégorisation intelligente</strong> basée sur les descriptions</li>
                    <li>• <strong>Format de date automatique</strong> - Conversion des dates Desjardins</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Important</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Vos données restent <strong>100% locales</strong> - Rien n'est envoyé sur internet</li>
                    <li>• Vérifiez toujours les transactions importées</li>
                    <li>• Les dépôts et virements entrants sont automatiquement ignorés</li>
                    <li>• Seuls les débits (dépenses) sont importés</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compris !
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesTab;
