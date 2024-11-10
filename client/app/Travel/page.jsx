"use client"
import { useState, useEffect } from 'react';
import PerformanceChart from '../dashboard/PerformanceChart';
import { CloudCog } from 'lucide-react';
import React from 'react';
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

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ecoSuggestions, setEcoSuggestions] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Initial data loading
  useEffect(() => {
    console.log('Initial load effect running');
    const token = localStorage.getItem('token');
    const fitnessData = localStorage.getItem('fitnessData');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (fitnessData) {
        const parsedData = JSON.parse(fitnessData);
        console.log('Setting steps from localStorage:', parsedData.length);
        setSteps(parsedData);
      } else {
        console.log('Fetching steps from API');
        fetchSteps(token);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const fetchSteps = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/steps', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        console.error('API Error:', data.error);
        return;
      }
      
      console.log('Steps fetched successfully:', data.length);
      setSteps(data);
      localStorage.setItem('fitnessData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fitnessData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isGoogleSignup');
    setIsLoggedIn(false);
    setUser(null);
    setSteps([]);
    setShowDropdown(false);
  };

  const login = async () => {
    const response = await fetch('http://localhost:5000/login');
    const data = await response.json();
    window.location.href = data.url;
  };

  const handleUserData = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const getActivityName = (activityType) => {
    const activities = {
        7: 'Walking',
        8: 'Running',
        1: 'Biking',
        3: 'Still (not moving)',
        4: 'Unknown',
        9: 'In vehicle',
    };
    return activities[activityType] || 'Unknown';
  };  

  const getLast7Days = (data) => {
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayData = data.find(d => d.date === dateString) || {
        date: dateString,
        steps: 0,
        distance: 0
      };
      
      last7Days.push(dayData);
    }
    
    return last7Days;
  };

  const calculateWeeklyAverage = (data) => {
    const last7Days = getLast7Days(data);
    if (last7Days.length === 0) return {
      avgSteps: 0,
      avgDistance: "0.00"
    };
    
    const totalSteps = last7Days.reduce((sum, day) => sum + day.steps, 0);
    const totalDistance = last7Days.reduce((sum, day) => sum + day.distance, 0);
    
    return {
      avgSteps: Math.round(totalSteps / last7Days.length),
      avgDistance: (totalDistance / last7Days.length / 1000).toFixed(2)
    };
  };

  const performanceData = {
    labels: getLast7Days(steps).map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    paceData: getLast7Days(steps).map(day => day.steps),
  };

  const getEcoSuggestions = async () => {
    console.log('Getting eco suggestions');
    setIsLoadingSuggestions(true);
    try {
      const weeklyAverage = calculateWeeklyAverage(steps);
      const todayData = steps.length > 0 ? steps[steps.length - 1] : { steps: 0, distance: 0 };

      const requestData = {
        stepsData: {
          todaySteps: todayData.steps,
          todayDistance: todayData.distance,
        },
        weeklyAverage: {
          avgSteps: weeklyAverage.avgSteps,
          avgDistance: weeklyAverage.avgDistance,
        }
      };

      console.log('Sending request to /ai with data:', requestData);

      const response = await fetch('http://localhost:5000/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received eco suggestions:', data);
      setEcoSuggestions(data.message);
    } catch (error) {
      console.error('Error getting eco suggestions:', error);
      setEcoSuggestions('Unable to load personalized suggestions at this time.');
    }
    setIsLoadingSuggestions(false);
  };

  // Effect to trigger eco suggestions fetch
  useEffect(() => {
    console.log('Steps changed, length:', steps.length);
    if (steps.length > 0) {
      console.log('Triggering eco suggestions fetch');
      getEcoSuggestions();
    }
  }, [steps]); // Only depend on steps changing

  return (
    <div>
      <Sidebar />
      <div className="p-8 bg-white">
        <h1 className="ml-24 text-4xl font-bold text-gray-700">Step Counter</h1>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={login}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Login with Google
              </button>
            )}
          </div>

          {isLoggedIn && (
            <div className="flex flex-col mt-4">
              <div className="w-full mb-8 px-2 pb-2">
                <PerformanceChart performanceData={performanceData} style={{ color: '#fff' }} />
              </div>

              <div className="flex flex-row gap-4 mb-8">
                <div className="flex-1 bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Stats</h2>
                  <div className="text-2xl font-bold text-blue-600">
                    {(steps.length > 0 ? steps[steps.length - 1].steps : 0).toLocaleString()} steps
                  </div>
                  <div className="text-lg text-gray-600">
                    {(steps.length > 0 ? steps[steps.length - 1].distance / 1000 : 0).toFixed(2)} km
                  </div>
                </div>

                <div className="flex-1 bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">7-Day Average</h2>
                  <div className="text-2xl font-bold text-green-600">
                    {calculateWeeklyAverage(steps).avgSteps.toLocaleString()} steps
                  </div>
                  <div className="text-lg text-gray-600">
                    {calculateWeeklyAverage(steps).avgDistance} km
                  </div>
                </div>
              </div>

              {steps.length > 0 && steps[steps.length - 1].activities && (
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-gray-800 font-medium">Today's Activities:</div>
                  {steps[steps.length - 1].activities.map((activity, index) => (
                    <div key={index} className='text-gray-800'>
                      {getActivityName(activity.type)}: {activity.duration_minutes} minutes
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-green-600">
                🌱 Your Eco Impact
              </h2>
              
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : ecoSuggestions ? (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    {ecoSuggestions.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      💡 Quick Tips
                    </h3>
                    <ul className="list-disc list-inside text-green-600 space-y-2">
                      {ecoSuggestions.match(/•[^•]*/g)?.map((tip, index) => (
                        <li key={index} className="text-gray-700">
                          {tip.replace('•', '').trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  You're making great strides! Walking 5000 steps daily reduces your carbon footprint by 240 kg of CO2 per year - equivalent to planting 12 trees. To boost your impact, try walking for local errands within 2 km instead of driving, consider car-sharing or bike-sharing services for longer trips, and offset any missed step goals with home energy-saving habits like using efficient light bulbs and turning off standby appliances.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}