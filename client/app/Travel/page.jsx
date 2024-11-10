"use client"
import { useState, useEffect } from 'react';
import PerformanceChart from '../dashboard/PerformanceChart';
export default function Home() {
  const [steps, setSteps] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fitnessData = localStorage.getItem('fitnessData');
    
    if (token) {
      setIsLoggedIn(true);
      if (fitnessData) {
        setSteps(JSON.parse(fitnessData));
      } else {
        fetchSteps(token);
      }
    }
  }, []);

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
      
      setSteps(data);
      localStorage.setItem('fitnessData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fitnessData');
    localStorage.removeItem('isGoogleSignup');
    setIsLoggedIn(false);
    setSteps([]);
  };

  const login = async () => {
    const response = await fetch('http://localhost:5000/login');
    const data = await response.json();
    window.location.href = data.url;
  };

  const getActivityName = (activityType) => {
    const activities = {
        7: 'Walking',
        8: 'Running',
        1: 'Biking',
        3: 'Still (not moving)',
        4: 'Unknown',
        9: 'In vehicle',
        // Add more activity types as needed
    };
    return activities[activityType] || 'Unknown';
  };  

  const getLast7Days = (data) => {
    const today = new Date();
    const last7Days = [];
    
    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find matching data or use 0
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
      // Format date to be more readable (e.g., "Mar 15")
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    paceData: getLast7Days(steps).map(day => day.steps),
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Step Counter</h1>
          {isLoggedIn ? (
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
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
              <PerformanceChart performanceData={performanceData} style={{ backgroundColor: '#ffffff', color: '#fff' }} />
            </div>

            <div className="flex flex-row gap-4 mb-8">
              <div className="flex-1 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Today's Stats</h2>
                <div className="text-2xl font-bold text-blue-600">
                  {(steps.length > 0 ? steps[steps.length - 1].steps : 0).toLocaleString()} steps
                </div>
                <div className="text-lg text-gray-600">
                  {(steps.length > 0 ? steps[steps.length - 1].distance / 1000 : 0).toFixed(2)} km
                </div>
              </div>

              <div className="flex-1 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">7-Day Average</h2>
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
                <div className="font-medium">Today's Activities:</div>
                {steps[steps.length - 1].activities.map((activity, index) => (
                  <div key={index}>
                    {getActivityName(activity.type)}: {activity.duration_minutes} minutes
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}