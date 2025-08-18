'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api.js';

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Logging out...');

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setStatus('Logging out from server...');
        await authAPI.logout();
        
        setStatus('Clearing local data...');
        // Clear any stored user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.clear();
        
        setStatus('Redirecting...');
        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        setStatus('Logout completed');
        // Even if API fails, clear local data and redirect
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.clear();
        router.push('/');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">🚪</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Logging Out</h1>
        <p className="text-gray-600 mb-6">{status}</p>
        
        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>✓ Clearing session data</p>
          <p>✓ Logging out from server</p>
          <p>✓ Redirecting to home page</p>
        </div>
        
        <div className="mt-6">
          <p className="text-xs text-gray-400">
            Thank you for using Surprise Tokri!
          </p>
        </div>
      </div>
    </div>
  );
} 