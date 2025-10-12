'use client';

import React, { useState, useEffect } from 'react';

interface QuizNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function QuizNumberInput({ value, onChange, error }: QuizNumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // 1-100
    onChange(randomNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string for editing
    if (newValue === '') {
      setInputValue('');
      return;
    }
    
    // Only allow numbers
    if (!/^\d+$/.test(newValue)) {
      return;
    }
    
    const numValue = parseInt(newValue, 10);
    
    // Validate range
    if (numValue >= 1 && numValue <= 100) {
      setInputValue(newValue);
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // If input is empty or invalid, reset to current value
    if (inputValue === '' || parseInt(inputValue, 10) < 1 || parseInt(inputValue, 10) > 100) {
      setInputValue(value.toString());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Quiz Number
        </label>
        <button
          type="button"
          onClick={generateRandomNumber}
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
        >
          Generate Random
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="number"
          min="1"
          max="100"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-24 px-3 py-2 bg-gray-700 border rounded-lg text-white text-center focus:outline-none focus:border-yellow-400 ${
            error ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="1-100"
        />
        <span className="text-gray-400 text-sm">
          (1-100)
        </span>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <p className="text-gray-400 text-xs">
        This number will be used to identify your quiz in the system.
      </p>
    </div>
  );
}
