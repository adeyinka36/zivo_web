'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Home } from 'lucide-react';

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-64 bg-black border-r border-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <Link href="/explore" className="block mb-8">
          <Image
            src="/logo.png"
            alt="Zivo Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <nav className="space-y-2">
          <Link
            href="/explore"
            className="flex items-center px-4 py-3 text-yellow-400 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <Home className="mr-3" size={20} />
            Explore
          </Link>
          
          <Link
            href="/create"
            className="flex items-center px-4 py-3 text-yellow-400 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <div className="w-5 h-5 mr-3 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-black text-xs font-bold">+</span>
            </div>
            Create
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Link
          href="/profile"
          className="flex items-center px-4 py-3 text-yellow-400 hover:bg-gray-900 rounded-lg transition-colors"
        >
          <User className="mr-3" size={20} />
          Profile
        </Link>
      </div>
    </div>
  );
}
