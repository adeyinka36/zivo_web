'use client';

import React, { useState, useEffect } from 'react';

interface WatchNotificationProps {
  isVisible: boolean;
  isFirstTime: boolean;
  mediaType: 'video' | 'image';
  hasBeenWatched: boolean;
}

export default function WatchNotification({ isVisible, isFirstTime, mediaType, hasBeenWatched }: WatchNotificationProps) {
  const [show, setShow] = useState(false);
  const [shouldSlide, setShouldSlide] = useState(false);

  useEffect(() => {
    if (isVisible || hasBeenWatched) {
      if (isFirstTime && isVisible) {
        setShouldSlide(true);
        setTimeout(() => setShow(true), 100);
      } else {
        setShow(true);
        setShouldSlide(false);
      }
    } else {
      setShow(false);
      setShouldSlide(false);
    }
  }, [isVisible, isFirstTime, hasBeenWatched]);

  if (!show) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        shouldSlide ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'
      }`}
      style={{
        transform: shouldSlide 
          ? 'translateX(-50%) translateY(0)' 
          : 'translateX(-50%) translateY(0)'
      }}
    >
      <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg font-bold text-lg">
        {mediaType === 'video' ? 'Watch Recorded' : 'Image Viewed!'}
      </div>
    </div>
  );
}
