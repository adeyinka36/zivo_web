'use client';

import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import AuthGuard from '../../components/auth/AuthGuard';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                <User size={32} className="text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user?.name || 'User'}</h1>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="flex items-center gap-3 w-full p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings size={20} />
                    <span>Edit Profile</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <User size={20} />
                    <span>Privacy Settings</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}