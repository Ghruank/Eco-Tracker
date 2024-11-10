'use client';

import React, { useState } from 'react';
import { Leaf, Award, Gauge, Plane, BatteryCharging } from 'lucide-react';
import { Bar, XAxis, YAxis, Tooltip, BarChart, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const Sidebar = () => (
    <div className="fixed left-0 top-0 h-full w-16 hover:w-48 bg-green-800 text-white transition-all duration-300">
      <div className="flex flex-col items-center py-4 space-y-8">
        <div className="w-full px-4">
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <Leaf className="w-8 h-8" />
            </div>
            <span className="ml-4 text-white text-lg transition-all duration-300">Greenit</span>
          </div>
        </div>
        
        <Link href="/dashboard" className="w-full px-4">
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <Gauge className="w-6 h-6" />
            </div>
            <span className="ml-4 text-white text-lg transition-all duration-300 hover:font-bold">Dashboard</span>
          </div>
        </Link>
  
        <Link href="/Travel" className="w-full px-4">
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <span className="ml-4 text-white text-lg transition-all duration-300 hover:font-bold">Travel</span>
          </div>
        </Link>
  
        <Link href="/power" className="w-full px-4">
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <span className="ml-4 text-white text-lg transition-all duration-300 hover:font-bold">Energy</span>
          </div>
        </Link>
      </div>
    </div>
  );

const PerformanceMetrics = ({ coins }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-green-800">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <Award className="mr-2" /> Eco Coins
    </h2>
    <div className="text-4xl font-bold">{coins}</div>
    <p className="mt-2 text-sm">Keep up the great work!</p>
  </div>
);

const EcoPointsHistogram = ({ users, userEcoPoints }) => {
  const data = [
    { range: '0-20', count: users.filter(u => u.ecoPoints >= 0 && u.ecoPoints <= 20).length },
    { range: '21-40', count: users.filter(u => u.ecoPoints > 20 && u.ecoPoints <= 40).length },
    { range: '41-60', count: users.filter(u => u.ecoPoints > 40 && u.ecoPoints <= 60).length },
    { range: '61-80', count: users.filter(u => u.ecoPoints > 60 && u.ecoPoints <= 80).length },
    { range: '81-100', count: users.filter(u => u.ecoPoints > 80 && u.ecoPoints <= 100).length },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-green-800">
        Your Eco Points: <span className="font-bold">{userEcoPoints}</span>
      </div>
    </div>
  );
};

const EcoTip = ({ tip }) => (
  <div className="bg-green-100 rounded-lg p-4 text-green-800 mt-4">
    <h3 className="font-bold mb-2">Eco Tip of the Day</h3>
    <p>{tip}</p>
  </div>
);

const ActionItem = ({ title, description, completed, onToggle }) => (
  <div className="flex items-center justify-between bg-white rounded-lg p-4 mb-2 shadow">
    <div>
      <h3 className="font-bold text-green-800">{title}</h3>
      <p className="text-sm text-green-600">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-full ${
        completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  </div>
);

const Dashboard = () => {
  const [coins, setCoins] = useState(256);
  const [actionItems, setActionItems] = useState([
    { id: 1, title: 'Recycle Paper', description: 'Recycle 5 sheets of paper', completed: false },
    { id: 2, title: 'Save Energy', description: 'Turn off lights for 1 hour', completed: false },
    { id: 3, title: 'Reduce Water Usage', description: 'Take a 5-minute shower', completed: false },
  ]);

  const generateUsers = (count = 50) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      ecoPoints: Math.floor(Math.random() * 101),
    }));
  };

  const users = generateUsers(50);
  const userEcoPoints = 75;

  const toggleActionItem = (id) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    setCoins(prevCoins => prevCoins + 10); // Award 10 coins for completing an action
  };

  return (
    <div className="min-h-screen bg-green-50 text-green-900">
      <Sidebar />
      <div className="ml-16 p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-800">Green</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EcoPointsHistogram users={users} userEcoPoints={userEcoPoints} />
          </div>
          <div>
            <PerformanceMetrics coins={coins} />
            <EcoTip tip="Using a reusable water bottle can save up to 1,460 plastic bottles per year!" />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Today's Eco Actions</h2>
          {actionItems.map(item => (
            <ActionItem
              key={item.id}
              {...item}
              onToggle={() => toggleActionItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;