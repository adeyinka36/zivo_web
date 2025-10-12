'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { navigationItems, getActiveNavItem } from './navData';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../ui/SearchInput';

export default function Header({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  const activeItem = getActiveNavItem(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (searchTerm: string) => {
    router.push(`/explore?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className={`w-full ${className}`}>
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
          <Link href="/explore" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">Z</span>
            </div>
            <span className="text-yellow-400 font-bold text-xl">Zivo</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yellow-400 text-black'
                      : 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <nav className="py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 rounded-lg transition-colors w-full"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        )}
        </div>
      </header>
      
      {/* Search input for small screens */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Search media..."
          size="md"
        />
      </div>
    </div>
  );
}
