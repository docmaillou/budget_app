import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, Users, AlertTriangle, TrendingUp, TrendingDown, Wallet, Target, Calendar, Edit2, Trash2, Check, X, Settings, UserPlus, UserMinus } from 'lucide-react';

const FamilyBudgetApp = () => {
  // Fonctions de sauvegarde et chargement
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key}:`, error);
      return defaultValue;
    }
  };

  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  };

  // États avec sauvegarde locale
  const [activeTab, setActiveTab] = useState('dashboard');
  const [familyMembers, setFamilyMembers] = useState(() => loadFromStorage('familyMembers', []));
  const [currentMember, setCurrentMember] = useState(() => loadFromStorage('currentMember', ''));
  const [isFirstTime, setIsFirstTime] = useState(() => loadFromStorage('isFirstTime', true));
  const [showSettings, setShowSettings] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(() => loadFromStorage('monthlyIncome', 5000));
  const [editingIncome, setEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(() => loadFromStorage('monthlyIncome', 5000));

  const [expenses, setExpenses] = useState(() => loadFromStorage('expenses', [
    { id: 1, category: 'Épicerie', amount: 120, member: 'Antoine', date: '2025-06-25', description: 'Courses hebdomadaires' },
    { id: 2, category: 'Essence', amount: 45, member: 'Dad', date: '2025-06-24', description: 'Station Shell' },
    { id: 3, category: 'Factures', amount: 280, member: 'Antoine', date: '2025-06-23', description: 'Facture électricité' },
    { id: 4, category: 'Divertissement', amount: 35, member: 'Alex', date: '2025-06-22', description: 'Billets cinéma' },
  ]));

  const [budgets, setBudgets] = useState(() => loadFromStorage('budgets', {
    'Épicerie': 400,
    'Essence': 200,
    'Factures': 800,
    'Divertissement': 150,
    'Restaurant': 300,
    'Shopping': 250,
    'Santé': 200,
    'Autre': 200
  }));

  const [newExpense, setNewExpense] = useState({
    category: 'Épicerie',
    amount: '',
    description: '',
    member: 'Antoine'
  });

  const [savingsGoal, setSavingsGoal] = useState(() => loadFromStorage('savingsGoal', 1000));
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(() => loadFromStorage('savingsGoal', 1000));

  const categories = Object.keys(budgets);

  // Sauvegarde automatique des données
  useEffect(() => {
    saveToStorage('familyMembers', familyMembers);
  }, [familyMembers]);

  useEffect(() => {
    saveToStorage('currentMember', currentMember);
  }, [currentMember]);

  useEffect(() => {
    saveToStorage('isFirstTime', isFirstTime);
  }, [isFirstTime]);

  useEffect(() => {
    saveToStorage('monthlyIncome', monthlyIncome);
  }, [monthlyIncome]);

  useEffect(() => {
    saveToStorage('expenses', expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage('budgets', budgets);
  }, [budgets]);

  useEffect(() => {
    saveToStorage('savingsGoal', savingsGoal);
  }, [savingsGoal]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const currentSavings = monthlyIncome - totalExpenses;

  // Calculate category spending
  const categorySpending = categories.reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {});

  // Get over-budget categories
  const overBudgetCategories = categories.filter(
    category => categorySpending[category] > budgets[category]
  );

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0],
      member: currentMember
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      category: 'Épicerie',
      amount: '',
      description: '',
      member: currentMember
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateBudget = (category, newBudget) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(newBudget) || 0
    }));
  };

  const saveIncome = () => {
    setMonthlyIncome(tempIncome);
    setEditingIncome(false);
  };

  const saveGoal = () => {
    setSavingsGoal(tempGoal);
    setEditingGoal(false);
  };

  // Fonction pour réinitialiser toutes les données
  const resetAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear();
      // Recharger la page pour réinitialiser l'application
      window.location.reload();
    }
  };

  // Fonction pour exporter les données
  const exportData = () => {
    const data = {
      familyMembers,
      currentMember,
      monthlyIncome,
      expenses,
      budgets,
      savingsGoal,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-familial-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // First time setup component
  const FirstTimeSetup = () => {
    const [setupMembers, setSetupMembers] = useState(['']);
    const [setupError, setSetupError] = useState('');

    const addMemberField = () => {
      setSetupMembers([...setupMembers, '']);
    };

    const removeMemberField = (index) => {
      if (setupMembers.length > 1) {
        setSetupMembers(setupMembers.filter((_, i) => i !== index));
      }
    };

    const updateMemberName = (index, name) => {
      const updated = [...setupMembers];
      updated[index] = name;
      setSetupMembers(updated);
    };

    const completeSetup = () => {
      const validMembers = setupMembers.filter(member => member.trim() !== '');

      if (validMembers.length === 0) {
        setSetupError('Veuillez ajouter au moins un membre de famille');
        return;
      }

      // Check for duplicates
      const uniqueMembers = [...new Set(validMembers.map(m => m.trim()))];
      if (uniqueMembers.length !== validMembers.length) {
        setSetupError('Les noms des membres doivent être uniques');
        return;
      }

      setFamilyMembers(uniqueMembers);
      setCurrentMember(uniqueMembers[0]);
      setIsFirstTime(false);
      setSetupError('');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue !</h1>
            <p className="text-gray-600">Configurons votre budget familial en ajoutant les membres de votre famille.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membres de la famille
            </label>

            {setupMembers.map((member, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Membre ${index + 1}`}
                  value={member}
                  onChange={(e) => updateMemberName(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {setupMembers.length > 1 && (
                  <button
                    onClick={() => removeMemberField(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addMemberField}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter un membre
            </button>

            {setupError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {setupError}
              </div>
            )}

            <button
              onClick={completeSetup}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Commencer à gérer mon budget
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Alertes Budget</span>
          </div>
          <div className="text-red-700">
            {overBudgetCategories.map(category => (
              <div key={category} className="text-sm">
                <span className="font-medium">{category}</span>: ${categorySpending[category]} / ${budgets[category]}
                <span className="text-red-600 ml-2">
                  (${(categorySpending[category] - budgets[category]).toFixed(2)} over)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Revenus Mensuels</p>
              <div className="flex items-center gap-2">
                {editingIncome ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">$</span>
                    <input
                      type="number"
                      value={tempIncome}
                      onChange={(e) => setTempIncome(parseFloat(e.target.value) || 0)}
                      className="w-20 px-1 py-0.5 text-lg font-bold bg-white border rounded"
                    />
                    <button onClick={saveIncome} className="text-green-600 hover:text-green-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingIncome(false)} className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-blue-800">${monthlyIncome.toLocaleString()}</p>
                    <button onClick={() => setEditingIncome(true)} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Dépensé</p>
              <p className="text-2xl font-bold text-red-800">${totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Budget Restant</p>
              <p className="text-2xl font-bold text-green-800">${remainingBudget.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Économies Actuelles</p>
              <p className={`text-2xl font-bold ${currentSavings >= 0 ? 'text-purple-800' : 'text-red-800'}`}>
                ${currentSavings.toLocaleString()}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${currentSavings >= 0 ? 'text-purple-600' : 'text-red-600'}`} />
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Objectif d'Épargne</h3>
          </div>
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 border rounded"
              />
              <button onClick={saveGoal} className="text-green-600 hover:text-green-700">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingGoal(false)} className="text-red-600 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">${savingsGoal.toLocaleString()}</span>
              <button onClick={() => setEditingGoal(true)} className="text-indigo-600 hover:text-indigo-700">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              currentSavings >= savingsGoal ? 'bg-green-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.min((currentSavings / savingsGoal) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentSavings >= savingsGoal
            ? `🎉 Objectif atteint ! Vous économisez ${(currentSavings - savingsGoal).toLocaleString()}$ de plus !`
            : `${(savingsGoal - currentSavings).toLocaleString()}$ restants`
          }
        </p>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dépenses par Catégorie</h3>
        <div className="space-y-3">
          {categories.map(category => {
            const spent = categorySpending[category] || 0;
            const budget = budgets[category];
            const percentage = (spent / budget) * 100;
            const isOverBudget = spent > budget;

            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ExpensesTab = () => (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Ajouter une Nouvelle Dépense
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
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
            onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addExpense}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Ajouter Dépense
          </button>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dépenses Récentes</h3>
        <div className="space-y-3">
          {expenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{expense.description}</span>
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">{expense.category}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {expense.member} • {expense.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg">${expense.amount}</span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BudgetTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Catégories de Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">{category}</label>
                <span className="text-sm text-gray-600">
                  ${categorySpending[category] || 0} dépensé
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <input
                  type="number"
                  value={budgets[category]}
                  onChange={(e) => updateBudget(category, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (categorySpending[category] || 0) > budgets[category] ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(((categorySpending[category] || 0) / budgets[category]) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => {
    const [newMemberName, setNewMemberName] = useState('');
    const [editingMember, setEditingMember] = useState(null);
    const [tempMemberName, setTempMemberName] = useState('');

    const addMember = () => {
      if (!newMemberName.trim()) return;
      if (familyMembers.includes(newMemberName.trim())) {
        alert('Ce membre existe déjà !');
        return;
      }
      setFamilyMembers([...familyMembers, newMemberName.trim()]);
      setNewMemberName('');
    };

    const deleteMember = (memberToDelete) => {
      if (familyMembers.length <= 1) {
        alert('Vous devez avoir au moins un membre dans la famille !');
        return;
      }

      // Si on supprime le membre actuellement sélectionné, changer pour le premier membre restant
      if (currentMember === memberToDelete) {
        const remainingMembers = familyMembers.filter(member => member !== memberToDelete);
        setCurrentMember(remainingMembers[0]);
      }

      setFamilyMembers(familyMembers.filter(member => member !== memberToDelete));
    };

    const startEditingMember = (member) => {
      setEditingMember(member);
      setTempMemberName(member);
    };

    const saveEditMember = () => {
      if (!tempMemberName.trim()) return;
      if (familyMembers.includes(tempMemberName.trim()) && tempMemberName.trim() !== editingMember) {
        alert('Ce nom existe déjà !');
        return;
      }

      const updatedMembers = familyMembers.map(member =>
        member === editingMember ? tempMemberName.trim() : member
      );

      // Mettre à jour le membre actuel si c'est celui qu'on modifie
      if (currentMember === editingMember) {
        setCurrentMember(tempMemberName.trim());
      }

      setFamilyMembers(updatedMembers);
      setEditingMember(null);
      setTempMemberName('');
    };

    const cancelEditMember = () => {
      setEditingMember(null);
      setTempMemberName('');
    };

    return (
      <div className="space-y-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Paramètres</h2>
            <p className="text-gray-600 mt-1">Gérez les membres de votre famille et les paramètres de l'application</p>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Fermer</span>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestion des Membres de la Famille
          </h3>

          {/* Add new member */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Ajouter un nouveau membre</h4>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nom du membre"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMember()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addMember}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Members list */}
          <div className="space-y-3">
            <h4 className="font-medium">Membres actuels ({familyMembers.length})</h4>
            {familyMembers.map(member => (
              <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  {editingMember === member ? (
                    <input
                      type="text"
                      value={tempMemberName}
                      onChange={(e) => setTempMemberName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEditMember()}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <span className="font-medium">{member}</span>
                      {currentMember === member && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Actuel
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingMember === member ? (
                    <>
                      <button
                        onClick={saveEditMember}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditMember}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditingMember(member)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMember(member)}
                        className="text-red-600 hover:text-red-700 p-1"
                        disabled={familyMembers.length <= 1}
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
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

  // Show first time setup if no family members
  if (isFirstTime || familyMembers.length === 0) {
    return <FirstTimeSetup />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 rounded-lg p-2 transition-colors group ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className={`text-2xl font-bold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-blue-700'
                    : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  Budget Familial
                </h1>
                <p className="text-gray-600 text-sm">Gérez vos finances familiales ensemble</p>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Paramètres</span>
              </button>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <select
                  value={currentMember}
                  onChange={(e) => setCurrentMember(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {familyMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Juin 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - either Settings or Main App */}
      {showSettings ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SettingsTab />
        </div>
      ) : (
        <>
          {/* Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
                  { id: 'expenses', label: 'Dépenses', icon: DollarSign },
                  { id: 'budget', label: 'Budget', icon: Target }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'expenses' && <ExpensesTab />}
            {activeTab === 'budget' && <BudgetTab />}
          </div>
        </>
      )}
    </div>
  );
};

export default FamilyBudgetApp;
