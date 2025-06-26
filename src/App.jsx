import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DollarSign, Users, TrendingUp, Target, Settings, X, Calendar, PlusCircle, Trash2, AlertTriangle } from 'lucide-react';

// Import des composants
import Dashboard from './components/Dashboard';
import ExpensesTab from './components/ExpensesTab';
import BudgetTab from './components/BudgetTab';
import FamilyTab from './components/FamilyTab';
import SettingsTab from './components/SettingsTab';
import FirstTimeSetup from './components/FirstTimeSetup';

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
  const [editingIncome, setEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(0);

  // Structure des données par membre
  const [memberData, setMemberData] = useState(() => loadFromStorage('memberData', {}));

  // Données par défaut pour un nouveau membre
  const getDefaultMemberData = () => ({
    monthlyIncome: 0,
    expenses: [],
    budgets: {
      'Épicerie': 0,
      'Essence': 0,
      'Factures': 0,
      'Divertissement': 0,
      'Restaurant': 0,
      'Shopping': 0,
      'Santé': 0,
      'Autre': 0
    },
    savingsGoal: 0
  });

  // États pour les formulaires
  const [newExpense, setNewExpense] = useState({
    category: 'Épicerie',
    amount: '',
    description: ''
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(0);

  // État pour les budgets en cours d'édition
  const [editingBudgets, setEditingBudgets] = useState({});

  // États pour la gestion des membres
  const [editingMember, setEditingMember] = useState(null);
  const [tempMemberName, setTempMemberName] = useState('');

  // Obtenir les données du membre actuel
  const getCurrentMemberData = useCallback(() => {
    if (!currentMember || !memberData[currentMember]) {
      return getDefaultMemberData();
    }
    // S'assurer que toutes les propriétés existent
    const data = memberData[currentMember];
    return {
      monthlyIncome: data.monthlyIncome || 0,
      expenses: data.expenses || [],
      budgets: data.budgets || getDefaultMemberData().budgets,
      savingsGoal: data.savingsGoal || 0
    };
  }, [currentMember, memberData]);

  // Mettre à jour les données d'un membre
  const updateMemberData = useCallback((member, newData) => {
    if (!member) return;

    setMemberData(prevMemberData => {
      const currentMemberData = prevMemberData[member] || getDefaultMemberData();
      const updatedMemberData = {
        ...prevMemberData,
        [member]: { ...currentMemberData, ...newData }
      };
      saveToStorage('memberData', updatedMemberData);
      return updatedMemberData;
    });
  }, []);

  // Données du membre actuel (mémorisées pour éviter les re-rendus)
  const currentData = useMemo(() => getCurrentMemberData(), [getCurrentMemberData]);
  const categories = useMemo(() => Object.keys(currentData.budgets || {}), [currentData.budgets]);

  // Sauvegarde automatique des données principales
  useEffect(() => {
    saveToStorage('familyMembers', familyMembers);
  }, [familyMembers]);

  useEffect(() => {
    saveToStorage('currentMember', currentMember);
  }, [currentMember]);

  useEffect(() => {
    saveToStorage('isFirstTime', isFirstTime);
  }, [isFirstTime]);

  // Calculate totals pour le membre actuel (mémorisés)
  const totalExpenses = useMemo(() =>
    currentData.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [currentData.expenses]
  );

  const totalBudget = useMemo(() =>
    Object.values(currentData.budgets).reduce((sum, budget) => sum + budget, 0),
    [currentData.budgets]
  );

  const remainingBudget = useMemo(() => totalBudget - totalExpenses, [totalBudget, totalExpenses]);
  const currentSavings = useMemo(() => currentData.monthlyIncome - totalExpenses, [currentData.monthlyIncome, totalExpenses]);

  // Calculate category spending pour le membre actuel (mémorisé)
  const categorySpending = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = currentData.expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    }, {});
  }, [categories, currentData.expenses]);

  // Get over-budget categories pour le membre actuel (mémorisé)
  const overBudgetCategories = useMemo(() =>
    categories.filter(category => categorySpending[category] > currentData.budgets[category]),
    [categories, categorySpending, currentData.budgets]
  );

  const addExpense = useCallback(() => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0],
      member: currentMember
    };

    const updatedExpenses = [expense, ...currentData.expenses];
    updateMemberData(currentMember, { expenses: updatedExpenses });

    setNewExpense({
      category: 'Épicerie',
      amount: '',
      description: ''
    });
  }, [newExpense, currentMember, currentData.expenses, updateMemberData]);

  const deleteExpense = useCallback((id) => {
    const updatedExpenses = currentData.expenses.filter(expense => expense.id !== id);
    updateMemberData(currentMember, { expenses: updatedExpenses });
  }, [currentData.expenses, currentMember, updateMemberData]);

  const updateBudget = useCallback((category, newBudget) => {
    updateMemberData(currentMember, {
      budgets: {
        ...currentData.budgets,
        [category]: parseFloat(newBudget) || 0
      }
    });
  }, [currentData.budgets, currentMember, updateMemberData]);

  const saveIncome = () => {
    updateMemberData(currentMember, { monthlyIncome: tempIncome });
    setEditingIncome(false);
  };

  const saveGoal = () => {
    updateMemberData(currentMember, { savingsGoal: tempGoal });
    setEditingGoal(false);
  };

  // Fonctions de callback stables pour éviter les re-rendus
  const handleIncomeChange = useCallback((e) => {
    setTempIncome(e.target.value === '' ? 0 : parseFloat(e.target.value));
  }, []);

  const handleGoalChange = useCallback((e) => {
    setTempGoal(e.target.value === '' ? 0 : parseFloat(e.target.value));
  }, []);

  const handleExpenseAmountChange = useCallback((e) => {
    setNewExpense(prev => ({ ...prev, amount: e.target.value }));
  }, []);

  const handleExpenseDescriptionChange = useCallback((e) => {
    setNewExpense(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleExpenseCategoryChange = useCallback((e) => {
    setNewExpense(prev => ({ ...prev, category: e.target.value }));
  }, []);

  // Fonctions pour gérer les budgets avec état temporaire
  const handleBudgetChange = useCallback((category) => (e) => {
    setEditingBudgets(prev => ({
      ...prev,
      [category]: e.target.value
    }));
  }, []);

  const handleBudgetBlur = useCallback((category) => () => {
    const value = editingBudgets[category];
    if (value !== undefined) {
      updateBudget(category, value);
      setEditingBudgets(prev => {
        const newState = { ...prev };
        delete newState[category];
        return newState;
      });
    }
  }, [editingBudgets, updateBudget]);

  const handleBudgetKeyPress = useCallback((category) => (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }, []);

  const getBudgetValue = useCallback((category) => {
    return editingBudgets[category] !== undefined
      ? editingBudgets[category]
      : (currentData.budgets[category] || 0);
  }, [editingBudgets, currentData.budgets]);

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
      memberData,
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

  // Fonction pour compléter la configuration initiale
  const completeSetup = (members) => {
    // Créer les données par défaut pour chaque membre
    const newMemberData = {};
    members.forEach(member => {
      newMemberData[member] = getDefaultMemberData();
    });

    setFamilyMembers(members);
    setCurrentMember(members[0]);
    setMemberData(newMemberData);
    setIsFirstTime(false);
  };

  // Fonctions de gestion des membres
  const addMember = useCallback((memberName) => {
    if (!memberName.trim()) return;
    if (familyMembers.includes(memberName.trim())) {
      alert('Ce membre existe déjà !');
      return;
    }

    const newMember = memberName.trim();
    setFamilyMembers([...familyMembers, newMember]);

    // Créer les données par défaut pour le nouveau membre
    const updatedMemberData = {
      ...memberData,
      [newMember]: getDefaultMemberData()
    };
    setMemberData(updatedMemberData);
    saveToStorage('memberData', updatedMemberData);
  }, [familyMembers, memberData]);

  const deleteMember = useCallback((memberToDelete) => {
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

    // Supprimer les données du membre
    const updatedMemberData = { ...memberData };
    delete updatedMemberData[memberToDelete];
    setMemberData(updatedMemberData);
    saveToStorage('memberData', updatedMemberData);
  }, [familyMembers, currentMember, memberData]);

  const saveEditMember = useCallback(() => {
    if (!tempMemberName.trim()) return;
    if (familyMembers.includes(tempMemberName.trim()) && tempMemberName.trim() !== editingMember) {
      alert('Ce nom existe déjà !');
      return;
    }

    const newName = tempMemberName.trim();
    const updatedMembers = familyMembers.map(member =>
      member === editingMember ? newName : member
    );

    // Mettre à jour le membre actuel si c'est celui qu'on modifie
    if (currentMember === editingMember) {
      setCurrentMember(newName);
    }

    // Mettre à jour les données du membre (changer la clé)
    const updatedMemberData = { ...memberData };
    if (editingMember !== newName) {
      updatedMemberData[newName] = updatedMemberData[editingMember];
      delete updatedMemberData[editingMember];
      setMemberData(updatedMemberData);
      saveToStorage('memberData', updatedMemberData);
    }

    setFamilyMembers(updatedMembers);
    setEditingMember(null);
    setTempMemberName('');
  }, [tempMemberName, familyMembers, editingMember, currentMember, memberData]);











  // Show first time setup if no family members
  if (isFirstTime || familyMembers.length === 0) {
    return <FirstTimeSetup onComplete={completeSetup} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 rounded-lg p-2 transition-colors group hover:bg-gray-50
              }`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                  src="./budget_logo.png"
                  alt="Budget Familial Logo"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <h1 className={`text-2xl font-bold transition-colors text-gray-900 group-hover:text-blue-600 }`}>
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
          <SettingsTab
            familyMembers={familyMembers}
            addMember={addMember}
            deleteMember={deleteMember}
            editingMember={editingMember}
            setEditingMember={setEditingMember}
            tempMemberName={tempMemberName}
            setTempMemberName={setTempMemberName}
            saveEditMember={saveEditMember}
            resetAllData={resetAllData}
            exportData={exportData}
          />
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
                  { id: 'budget', label: 'Budget', icon: Target },
                  { id: 'family', label: 'Famille', icon: Users }
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
            {activeTab === 'dashboard' && (
              <Dashboard
                currentData={currentData}
                totalExpenses={totalExpenses}
                totalBudget={totalBudget}
                remainingBudget={remainingBudget}
                currentSavings={currentSavings}
                overBudgetCategories={overBudgetCategories}
                categorySpending={categorySpending}
                editingIncome={editingIncome}
                setEditingIncome={setEditingIncome}
                tempIncome={tempIncome}
                handleIncomeChange={handleIncomeChange}
                saveIncome={saveIncome}
                editingGoal={editingGoal}
                setEditingGoal={setEditingGoal}
                tempGoal={tempGoal}
                handleGoalChange={handleGoalChange}
                saveGoal={saveGoal}
              />
            )}
            {activeTab === 'expenses' && (
              <ExpensesTab
                currentData={currentData}
                categories={categories}
                newExpense={newExpense}
                handleExpenseCategoryChange={handleExpenseCategoryChange}
                handleExpenseAmountChange={handleExpenseAmountChange}
                handleExpenseDescriptionChange={handleExpenseDescriptionChange}
                addExpense={addExpense}
                deleteExpense={deleteExpense}
                categorySpending={categorySpending}
              />
            )}
            {activeTab === 'budget' && (
              <BudgetTab
                categories={categories}
                getBudgetValue={getBudgetValue}
                handleBudgetChange={handleBudgetChange}
                handleBudgetBlur={handleBudgetBlur}
                handleBudgetKeyPress={handleBudgetKeyPress}
                categorySpending={categorySpending}
              />
            )}
            {activeTab === 'family' && (
              <FamilyTab
                familyMembers={familyMembers}
                memberData={memberData}
                getDefaultMemberData={getDefaultMemberData}
                setCurrentMember={setCurrentMember}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FamilyBudgetApp;
