"use client"
import { useState, useEffect } from 'react';

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
          <div className="space-y-4">
            {steps.map(day => (
              <div 
                key={day.date} 
                className="bg-white p-4 rounded shadow"
              >
                <div className="font-medium">{day.date}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {day.steps.toLocaleString()} steps
                </div>
                <div className="text-lg text-gray-600">
          {(day.distance / 1000).toFixed(2)} km
        </div>
        {day.activities && day.activities.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
                <div className="font-medium">Activities:</div>
                {day.activities.map((activity, index) => (
                    <div key={index}>
                        {getActivityName(activity.type)}: {activity.duration_minutes} minutes
                    </div>
                ))}
            </div>
        )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}