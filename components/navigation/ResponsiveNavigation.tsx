'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { NavigationProps } from '../../types/navigation';

export default function ResponsiveNavigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  
  const isAuthPage = pathname.startsWith('/login') || 
                    pathname.startsWith('/register') || 
                    pathname.startsWith('/forgot-password') ||
                    pathname.startsWith('/reset-password');

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-full lg:z-10">
        <Sidebar className={className} />
      </div>
      <div className="lg:hidden w-full">
        <Header className={className} />
      </div>
    </>
  );
}
