'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black border-b border-gray-800">
      <Link
        href="/profile"
        className="flex items-center justify-center w-12 h-12 text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        <User size={36} />
      </Link>

      <Link
        href="/explore"
        className="flex items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="Zivo Logo"
          width={72}
          height={72}
          className="object-contain"
        />
      </Link>

      <Link
        href="/create"
        className="flex items-center justify-center w-12 h-12 text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        <PlusCircle size={36} />
      </Link>
    </header>
  );
}
