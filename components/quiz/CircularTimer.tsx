'use client';

import React, { useEffect, useRef } from 'react';

interface CircularTimerProps {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  totalTime: number;
}

export default function CircularTimer({ timeLeft, setTimeLeft, totalTime }: CircularTimerProps) {
  const radius = 30;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={80} height={80} className="transform -rotate-90">
          <circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#333333"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#FFFF00"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-400 text-xl font-bold">
            {timeLeft}s
          </span>
        </div>
      </div>
    </div>
  );
}
