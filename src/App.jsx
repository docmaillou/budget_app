import React, { useState } from 'react';
import { PlusCircle, DollarSign, Users, AlertTriangle, TrendingUp, TrendingDown, Wallet, Target, Calendar, Edit2, Trash2, Check, X } from 'lucide-react';

const FamilyBudgetApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [familyMembers] = useState(['Antoine', 'Dad', 'Alex', 'Sarah']);
  const [currentMember, setCurrentMember] = useState('Antoine');
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [editingIncome, setEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(5000);

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Groceries', amount: 120, member: 'Antoine', date: '2025-06-25', description: 'Weekly shopping' },
    { id: 2, category: 'Gas', amount: 45, member: 'Dad', date: '2025-06-24', description: 'Shell station' },
    { id: 3, category: 'Bills', amount: 280, member: 'Antoine', date: '2025-06-23', description: 'Electricity bill' },
    { id: 4, category: 'Entertainment', amount: 35, member: 'Alex', date: '2025-06-22', description: 'Movie tickets' },
  ]);

  const [budgets, setBudgets] = useState({
    'Groceries': 400,
    'Gas': 200,
    'Bills': 800,
    'Entertainment': 150,
    'Dining Out': 300,
    'Shopping': 250,
    'Healthcare': 200,
    'Other': 200
  });

  const [newExpense, setNewExpense] = useState({
    category: 'Groceries',
    amount: '',
    description: '',
    member: 'Antoine'
  });

  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(1000);

  const categories = Object.keys(budgets);

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
      category: 'Groceries',
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

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Budget Alerts</span>
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
              <p className="text-blue-600 text-sm font-medium">Monthly Income</p>
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
              <p className="text-red-600 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-red-800">${totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Remaining Budget</p>
              <p className="text-2xl font-bold text-green-800">${remainingBudget.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Current Savings</p>
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
            <h3 className="text-lg font-semibold">Savings Goal</h3>
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
            ? `🎉 Goal achieved! You're saving $${(currentSavings - savingsGoal).toLocaleString()} extra!`
            : `$${(savingsGoal - currentSavings).toLocaleString()} to go`
          }
        </p>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Category Spending</h3>
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
          Add New Expense
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
            placeholder="Amount"
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
            Add Expense
          </button>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
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
        <h3 className="text-lg font-semibold mb-4">Budget Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">{category}</label>
                <span className="text-sm text-gray-600">
                  ${categorySpending[category] || 0} spent
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Budget Tracker</h1>
              <p className="text-gray-600">Manage your family finances together</p>
            </div>
            <div className="flex items-center gap-4">
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
                <span>June 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'expenses', label: 'Expenses', icon: DollarSign },
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
    </div>
  );
};

export default FamilyBudgetApp;
