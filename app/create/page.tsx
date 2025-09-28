'use client';

import React from 'react';
import Header from '../../components/Header';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Create Content</h1>
          <p className="text-gray-400">This page is coming soon!</p>
        </div>
      </div>
    </div>
  );
}
