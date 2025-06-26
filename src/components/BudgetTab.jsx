import React from 'react';
import { Target } from 'lucide-react';

const BudgetTab = ({ 
  categories, 
  getBudgetValue, 
  handleBudgetChange, 
  handleBudgetBlur, 
  handleBudgetKeyPress, 
  categorySpending 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Catégories de Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{category}</h4>
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <input
                  type="number"
                  value={getBudgetValue(category)}
                  onChange={handleBudgetChange(category)}
                  onBlur={handleBudgetBlur(category)}
                  onKeyPress={handleBudgetKeyPress(category)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (categorySpending[category] || 0) > getBudgetValue(category) ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(((categorySpending[category] || 0) / getBudgetValue(category)) * 100, 100)}%`
                  }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Dépensé: ${(categorySpending[category] || 0).toFixed(2)}</span>
                <span>
                  {((categorySpending[category] || 0) / getBudgetValue(category) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetTab;
