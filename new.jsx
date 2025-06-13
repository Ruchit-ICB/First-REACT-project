// Basic structure of Smart Expense Tracker

import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { v4 as uuidv4 } from "uuid";

const categories = ["Food", "Rent", "Shopping", "Transport", "Utilities", "Other"];
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

const App = () => {
  const [expenses, setExpenses] = useState(() => {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : [];
  });

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount) return;
    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toLocaleDateString(),
    };
    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setNote("");
  };

  const categoryTotals = categories.map((cat) => ({
    name: cat,
    value: expenses.filter((e) => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0),
  }));

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Expense Tracker</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border px-2 py-1 rounded w-full md:w-24"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-32"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="border px-2 py-1 rounded flex-1"
          />
          <button
            onClick={addExpense}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          <ul className="space-y-2">
            {expenses.map((exp) => (
              <li key={exp.id} className="border-b pb-2">
                <strong>₹{exp.amount.toFixed(2)}</strong> on <em>{exp.category}</em> ({exp.note || "No note"}) – {exp.date}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={categoryTotals}
              cx={150}
              cy={100}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {categoryTotals.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div className="mt-4 text-center text-lg">Total Spent: ₹{totalSpent.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
