'use client';

import React from 'react';
import Image from 'next/image';

export default function InitialLoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Zivo Logo"
            width={120}
            height={120}
            className="object-contain mx-auto"
          />
        </div>
        
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        
        <div className="text-white text-xl font-semibold mb-2">
          Loading Videos
        </div>
        
        <div className="text-gray-400 text-sm">
          Preparing your content...
        </div>
      </div>
    </div>
  );
}
