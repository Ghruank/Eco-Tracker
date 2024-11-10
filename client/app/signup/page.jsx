'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Sidebar from '../dashboard/sidebar';

const SustainableSignUp = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        if (json.authToken) {
          console.log("SignUp Success");
          localStorage.setItem('token', json.authToken);
          router.push(`/dashboard/${json.userId}`);
        }
      } else {
        setError(json.error || "Failed to sign up");
      }
    } catch (error) {
      setError("An error occurred while signing up. Please try again.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:5000/login');
      const data = await response.json();
      
      localStorage.setItem('isGoogleSignup', 'true');
      window.location.href = data.url;
    } catch (error) {
      setError("Failed to initialize Google Sign In");
    }
  };

  return (
    <div>
        <Sidebar/>
    <div className="flex items-center justify-center min-h-screen px-4 bg-green-50 ">
        
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md  p-6 space-y-6">
        
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <Leaf className="h-12 w-12 text-green-600 " />
          </div>
          <h2 className="text-2xl font-bold text-center text-green-800 ">
            Lesgooo Sign Up
          </h2>
          <p className="text-center text-green-600 dark:text-green-300">
            Join our eco-friendly community
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-green-700 ">
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@ecofriendly.com"
              required
              onChange={onChange}
              value={credentials.email}
              className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 "
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-green-700 ">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              onChange={onChange}
              value={credentials.password}
              className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-green-600 "
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-700 ">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              required
              onChange={onChange}
              value={credentials.confirmPassword}
              className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 "
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign in with Google
          </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-sm text-center text-green-600 ">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-green-800 hover:underline ">
            Login to your eco-account
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default SustainableSignUp;
