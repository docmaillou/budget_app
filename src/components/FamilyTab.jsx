import React, { useState } from 'react';
import { Users, BarChart3, X, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

const FamilyTab = ({
  familyMembers,
  memberData,
  getDefaultMemberData,
  setCurrentMember
}) => {
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  // Calculer les totaux pour toute la famille
  const familyTotals = familyMembers.reduce((totals, member) => {
    const data = memberData[member] || getDefaultMemberData();
    const memberExpenses = (data.expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
    const memberBudget = Object.values(data.budgets || {}).reduce((sum, budget) => sum + budget, 0);
    
    totals.totalIncome += data.monthlyIncome || 0;
    totals.totalExpenses += memberExpenses;
    totals.totalBudget += memberBudget;
    totals.totalSavingsGoal += data.savingsGoal || 0;
    
    return totals;
  }, { totalIncome: 0, totalExpenses: 0, totalBudget: 0, totalSavingsGoal: 0 });

  const familySavings = familyTotals.totalIncome - familyTotals.totalExpenses;
  const familyRemainingBudget = familyTotals.totalBudget - familyTotals.totalExpenses;

  // Composant de détails avec graphique
  const MemberDetailsModal = ({ member, onClose }) => {
    const data = memberData[member] || getDefaultMemberData();
    const memberExpenses = (data.expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
    const memberSavings = (data.monthlyIncome || 0) - memberExpenses;
    const memberBudget = Object.values(data.budgets || {}).reduce((sum, budget) => sum + budget, 0);

    // Données pour le graphique en barres
    const chartData = [
      { label: 'Revenus', value: data.monthlyIncome || 0, color: 'bg-blue-500', icon: DollarSign },
      { label: 'Dépenses', value: memberExpenses, color: 'bg-red-500', icon: TrendingDown },
      { label: 'Budget Total', value: memberBudget, color: 'bg-yellow-500', icon: Target },
      { label: 'Économies', value: memberSavings, color: memberSavings >= 0 ? 'bg-green-500' : 'bg-red-600', icon: TrendingUp }
    ];

    const maxValue = Math.max(...chartData.map(item => Math.abs(item.value)));

    // Dépenses par catégorie
    const categoryExpenses = (data.expenses || []).reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Détails de {member}</h2>
                  <p className="text-gray-600">Analyse financière détaillée</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Graphique en barres */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Vue d'ensemble financière</h3>
              <div className="space-y-4">
                {chartData.map((item, index) => {
                  const percentage = maxValue > 0 ? (Math.abs(item.value) / maxValue) * 100 : 0;
                  const Icon = item.icon;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className={`${item.color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            <span className="text-white text-xs font-medium">
                              ${Math.abs(item.value).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm font-semibold">
                          ${item.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dépenses par catégorie */}
            {Object.keys(categoryExpenses).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Dépenses par Catégorie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categoryExpenses).map(([category, amount]) => {
                    const budget = data.budgets?.[category] || 0;
                    const percentage = budget > 0 ? (amount / budget) * 100 : 0;
                    const isOverBudget = amount > budget;

                    return (
                      <div key={category} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{category}</span>
                          <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                            ${amount.toFixed(2)} / ${budget}
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
                          <p className="text-xs text-red-600 mt-1">
                            Dépassement: ${(amount - budget).toFixed(2)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Objectif d'épargne */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Progression de l'Objectif d'Épargne</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Objectif: ${(data.savingsGoal || 0).toLocaleString()}</span>
                  <span className={`font-semibold ${memberSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Économies actuelles: ${memberSavings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      memberSavings >= (data.savingsGoal || 0) ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${(data.savingsGoal || 0) > 0 ? Math.min((memberSavings / (data.savingsGoal || 1)) * 100, 100) : 0}%`
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {memberSavings >= (data.savingsGoal || 0)
                    ? `🎉 Objectif atteint ! Surplus: ${(memberSavings - (data.savingsGoal || 0)).toLocaleString()}$`
                    : `Restant: ${((data.savingsGoal || 0) - memberSavings).toLocaleString()}$ (${(data.savingsGoal || 0) > 0 ? Math.round((memberSavings / (data.savingsGoal || 1)) * 100) : 0}%)`
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setCurrentMember(member);
                  onClose();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gérer ce membre
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Résumé familial */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Résumé Familial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">Revenus Totaux</p>
            <p className="text-2xl font-bold text-blue-800">${familyTotals.totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-red-600 font-medium">Dépenses Totales</p>
            <p className="text-2xl font-bold text-red-800">${familyTotals.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">Budget Restant</p>
            <p className="text-2xl font-bold text-green-800">${familyRemainingBudget.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600 font-medium">Économies Familiales</p>
            <p className={`text-2xl font-bold ${familySavings >= 0 ? 'text-purple-800' : 'text-red-800'}`}>
              ${familySavings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Détails par membre */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {familyMembers.map(member => {
          const data = memberData[member] || getDefaultMemberData();
          const memberExpenses = (data.expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
          const memberSavings = (data.monthlyIncome || 0) - memberExpenses;
          
          return (
            <div key={member} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{member}</h4>
                <button
                  onClick={() => setSelectedMemberDetails(member)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  Voir détails →
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenus:</span>
                  <span className="font-medium">${(data.monthlyIncome || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dépenses:</span>
                  <span className="font-medium text-red-600">${memberExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Économies:</span>
                  <span className={`font-medium ${memberSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${memberSavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objectif épargne:</span>
                  <span className="font-medium">${(data.savingsGoal || 0).toLocaleString()}</span>
                </div>
                
                {/* Barre de progression objectif */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression objectif</span>
                    <span>{(data.savingsGoal || 0) > 0 ? Math.round((memberSavings / (data.savingsGoal || 1)) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        memberSavings >= (data.savingsGoal || 0) ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${(data.savingsGoal || 0) > 0 ? Math.min((memberSavings / (data.savingsGoal || 1)) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de détails */}
      {selectedMemberDetails && (
        <MemberDetailsModal
          member={selectedMemberDetails}
          onClose={() => setSelectedMemberDetails(null)}
        />
      )}
    </div>
  );
};

export default FamilyTab;
