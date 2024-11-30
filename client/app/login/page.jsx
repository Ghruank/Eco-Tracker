'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function SustainableLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted")

    try {
      const response = await fetch(`http://127.0.0.1:5000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const json = await response.json()
      console.log("Response JSON:", json)

      if (json.token) {
        console.log("Login Successful")
        localStorage.setItem('token', json.token)
        router.push(`/dashboard`) 
      } else {
        console.log("Login Failed")
        alert(json.error || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login. Please try again.")
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-green-50 ">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md  p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <Leaf className="h-12 w-12 text-green-600 " />
          </div>
          <h2 className="text-2xl font-bold text-center text-green-800 ">
            GreenIt Login
          </h2>
          <p className="text-center text-green-600">
            Enter your credentials to access your eco-friendly account
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
              className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 "
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login
          </button>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white "
          >
            Login using google
          </button>

        </form>
        <p className="text-sm text-center text-green-600 ">
          Don't have an account yet?{' '}
          <Link href="/signup" className="font-medium text-green-800 hover:underline ">
            Sign up for a greener future
          </Link>
        </p>
      </div>
    </div>
  )
}