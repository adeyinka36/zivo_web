'use client';

import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import AuthGuard from '../../components/auth/AuthGuard';

export default function CreatePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold mb-4">Create Content</h1>
            <p className="text-gray-400">This page is coming soon!</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
