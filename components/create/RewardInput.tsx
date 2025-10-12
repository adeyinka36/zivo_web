'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

interface RewardInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function RewardInput({ value, onChange, error }: RewardInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      onChange(0);
      return;
    }
    
    const numericValue = parseFloat(inputValue);
    
    if (isNaN(numericValue)) {
      return;
    }
    
    if (numericValue < 0) {
      return;
    }
    
    const roundedValue = Math.round(numericValue * 100) / 100;
    onChange(roundedValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Reward Amount
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign size={20} className="text-gray-400" />
        </div>
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Enter reward amount"
          className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 ${
            error ? 'border-red-500' : 'border-gray-600'
          }`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <p className="text-gray-400 text-sm">
        This is the reward viewers will earn for watching your content and answering the quiz. Minimum: $5.00. Cannot start with 0 (e.g., 0.50).
      </p>
    </div>
  );
}
