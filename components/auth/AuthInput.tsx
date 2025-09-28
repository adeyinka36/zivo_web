'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  name: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function AuthInput({
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && !isPasswordVisible ? 'password' : 'text';

  return (
    <div className="mb-4 w-full">
      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {isPasswordVisible ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
