'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ isVisible, message = 'Processing...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center space-y-4 min-w-[300px]">
        <LoadingSpinner />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
