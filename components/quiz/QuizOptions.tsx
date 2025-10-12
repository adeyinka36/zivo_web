'use client';

import React, { useState, useEffect } from 'react';

interface QuizOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onSelect: (index: number | null) => void;
  isAnswered: boolean;
  correctAnswer: number;
}

export default function QuizOptions({ 
  options, 
  selectedAnswer, 
  onSelect, 
  isAnswered, 
  correctAnswer 
}: QuizOptionsProps) {
  const [visibleOptions, setVisibleOptions] = useState<boolean[]>(new Array(options.length).fill(false));

  useEffect(() => {
    const animations = options.map((_, index) => {
      const delay = index * 150;
      return setTimeout(() => {
        setVisibleOptions(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay);
    });

    return () => animations.forEach(clearTimeout);
  }, [options.length]);

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index 
        ? "bg-yellow-400 border-yellow-400 text-black" 
        : "bg-transparent border-gray-600 text-white hover:border-yellow-400";
    }
    
    if (index === correctAnswer) {
      return "bg-green-500 border-green-500 text-white";
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return "bg-red-500 border-red-500 text-white";
    }
    
    return "bg-transparent border-gray-600 text-gray-400";
  };

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D'];
    return labels[index];
  };

  return (
    <div className="space-y-6">
      {options.map((option, index) => (
        <div
          key={index}
          className={`transform transition-all duration-700 ${
            visibleOptions[index] ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <button
            className={`w-full border-2 rounded-xl p-4 flex items-center transition-all duration-200 ${
              isAnswered ? 'cursor-default' : 'cursor-pointer hover:scale-105'
            } ${getOptionStyle(index)}`}
            onClick={() => !isAnswered && onSelect(index)}
            disabled={isAnswered}
          >
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center mr-4 flex-shrink-0">
              <span className="font-bold text-sm">
                {getOptionLabel(index)}
              </span>
            </div>
            <span className="text-lg flex-1 text-left">
              {option}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
