'use client';

import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthButtonProps {
  title: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function AuthButton({ 
  title, 
  onClick, 
  isLoading = false, 
  disabled = false 
}: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all ${
        isLoading || disabled
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95'
      }`}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        title
      )}
    </button>
  );
}
