'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { navigationItems, getActiveNavItem } from './navData';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../ui/SearchInput';

export default function Sidebar({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  const activeItem = getActiveNavItem(pathname);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (searchTerm: string) => {
    router.push(`/explore?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <aside className={`bg-gray-900 border-r border-gray-700 w-64 min-h-screen flex flex-col ${className}`}>
      <div className="p-6 border-b border-gray-700">
        <Link href="/explore" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">Z</span>
          </div>
          <span className="text-yellow-400 font-bold text-xl">Zivo</span>
        </Link>
      </div>

      <div className="p-4 border-b border-gray-700">
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Search media..."
          size="sm"
        />
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yellow-400 text-black'
                      : 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 rounded-lg transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
