import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Wallet, Target, Calendar, Edit2, Check, X } from 'lucide-react';

const Dashboard = ({ 
  currentData, 
  totalExpenses, 
  totalBudget, 
  remainingBudget, 
  currentSavings, 
  overBudgetCategories, 
  categorySpending,
  editingIncome,
  setEditingIncome,
  tempIncome,
  handleIncomeChange,
  saveIncome,
  editingGoal,
  setEditingGoal,
  tempGoal,
  handleGoalChange,
  saveGoal
}) => {
  return (
    <div className="space-y-6">
      {/* Budget Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Alertes Budget</span>
          </div>
          <div className="text-red-700">
            {overBudgetCategories.map(category => (
              <div key={category} className="text-sm">
                <span className="font-medium">{category}</span>: ${categorySpending[category]} / ${currentData.budgets[category]} 
                <span className="text-red-600 ml-2">
                  (${(categorySpending[category] - currentData.budgets[category]).toFixed(2)} over)
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
                      onChange={handleIncomeChange}
                      className="w-20 px-1 py-0.5 text-lg font-bold bg-white border rounded"
                      autoFocus
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
                    <p className="text-2xl font-bold text-blue-800">${currentData.monthlyIncome.toLocaleString()}</p>
                    <button onClick={() => {
                      setEditingIncome(true);
                      // tempIncome sera initialisé par handleIncomeChange
                    }} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Dépenses Totales</p>
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
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Économies Actuelles</p>
              <p className={`text-2xl font-bold ${currentSavings >= 0 ? 'text-indigo-800' : 'text-red-800'}`}>
                ${currentSavings.toLocaleString()}
              </p>
            </div>
            <Target className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Objectif d'Épargne</h3>
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <input
                type="number"
                value={tempGoal}
                onChange={handleGoalChange}
                className="w-24 px-2 py-1 border rounded"
                autoFocus
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
              <span className="text-lg font-semibold">${currentData.savingsGoal.toLocaleString()}</span>
              <button onClick={() => {
                setEditingGoal(true);
                // tempGoal sera initialisé par handleGoalChange
              }} className="text-indigo-600 hover:text-indigo-700">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              currentSavings >= currentData.savingsGoal ? 'bg-green-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.min((currentSavings / currentData.savingsGoal) * 100, 100)}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {currentSavings >= currentData.savingsGoal 
            ? `🎉 Objectif atteint ! Vous économisez ${(currentSavings - currentData.savingsGoal).toLocaleString()}$ de plus !`
            : `${(currentData.savingsGoal - currentSavings).toLocaleString()}$ restants`
          }
        </p>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dépenses par Catégorie</h3>
        <div className="space-y-3">
          {Object.keys(currentData.budgets || {}).map(category => {
            const spent = categorySpending[category] || 0;
            const budget = currentData.budgets[category];
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
};

export default Dashboard;
