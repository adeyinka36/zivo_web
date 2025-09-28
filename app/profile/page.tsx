'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-80px)] px-6">
        <div className="text-center max-w-md w-full">
          <h1 className="text-white text-2xl font-bold mb-4">Profile</h1>
          
          {user && (
            <div className="mb-8">
              <p className="text-gray-400 text-lg mb-2">
                Welcome, {user.name}!
              </p>
              <p className="text-gray-500 text-base">
                {user.email}
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-black py-3 px-8 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
