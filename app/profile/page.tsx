'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import AuthGuard from '../../components/auth/AuthGuard';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex">
        <Sidebar />
        <div className="flex-1 px-6 py-8">
          <h1 className="text-white text-2xl font-bold mb-8">Profile</h1>
          
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Email</p>
            <p className="text-white text-base">{user?.email || 'Not available'}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Username</p>
            <p className="text-white text-base">{user?.username || 'Not available'}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-4 rounded-lg w-full font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
