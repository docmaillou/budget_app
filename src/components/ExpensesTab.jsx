import React from 'react';
import { PlusCircle, DollarSign, Calendar, Trash2 } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Ajouter une Dépense
        </h3>
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
    </div>
  );
};

export default ExpensesTab;
