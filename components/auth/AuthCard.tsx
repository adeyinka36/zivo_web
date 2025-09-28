'use client';

import React from 'react';
import Image from 'next/image';

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  logoSize?: 'small' | 'medium' | 'large';
}

export default function AuthCard({ 
  title, 
  subtitle, 
  children, 
  logoSize = 'medium' 
}: AuthCardProps) {
  const logoDimensions = {
    small: { width: 96, height: 96 },
    medium: { width: 140, height: 140 },
    large: { width: 170, height: 170 },
  };

  const { width, height } = logoDimensions[logoSize];

  return (
    <div className="flex-1 flex items-center justify-center px-6 max-w-md w-full">
      <div className="w-full">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Zivo Logo"
            width={width}
            height={height}
            className="object-contain"
          />
        </div>
        
        {title && (
          <h1 className="text-white text-3xl font-bold mb-2 text-center">
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className="text-gray-400 text-lg mb-8 text-center">
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
}
