'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchInput({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  size = 'md'
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent spaces
    if (value.includes(' ')) {
      setError('Search term cannot contain spaces');
      return;
    }
    
    // Limit to 19 characters
    if (value.length > 19) {
      setError('Search term cannot exceed 19 characters');
      return;
    }
    
    setError('');
    setSearchTerm(value);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) {
      setError('Please enter a search term');
      return;
    }
    
    if (trimmedTerm.includes(' ')) {
      setError('Search term cannot contain spaces');
      return;
    }
    
    if (trimmedTerm.length > 19) {
      setError('Search term cannot exceed 19 characters');
      return;
    }
    
    setError('');
    onSearch(trimmedTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Search size={16} />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          maxLength={19}
          className={`
            w-full pl-10 pr-20 py-2 bg-gray-800 border border-gray-600 
            rounded-lg text-white placeholder-gray-400 focus:outline-none 
            focus:ring-2 focus:ring-yellow-400 focus:border-transparent
            ${sizeClasses[size]}
            ${error ? 'border-red-500' : ''}
          `}
        />
        
        <div className="absolute right-2 flex items-center space-x-1">
          {searchTerm && (
            <button
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <X size={14} />
            </button>
          )}
          
          <button
            onClick={handleSearch}
            className="p-1.5 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!searchTerm.trim()}
            type="button"
          >
            <Search size={14} />
          </button>
        </div>
      </div>
      
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      
      {searchTerm && (
        <p className="text-gray-400 text-xs">
          {searchTerm.length}/19 characters
        </p>
      )}
    </div>
  );
}
