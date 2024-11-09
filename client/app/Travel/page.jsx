"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchSteps(token);
    }
  }, []);

  const login = async () => {
    const response = await fetch('http://localhost:5000/login');
    const data = await response.json();
    window.location.href = data.url;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setSteps([]);
  };

  const fetchSteps = async (token) => {
    const response = await fetch('http://localhost:5000/steps', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setSteps(data);
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}