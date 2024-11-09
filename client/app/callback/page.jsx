"use client"

import { useEffect } from 'react';

export default function Callback() {
  useEffect(() => {
    async function handleCallback() {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const response = await fetch(`http://localhost:5000/callback?code=${code}`);
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/Travel';
      }
    }
    handleCallback();
  }, []);

  return <div>Processing login...</div>;
}