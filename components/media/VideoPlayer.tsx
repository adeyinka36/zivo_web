'use client';

import React from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Media } from '../../types/media';

interface VideoPlayerProps {
  media: Media;
  isVisible: boolean;
  onEyeClick: () => void;
  showInfo: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  isLoadingMore?: boolean;
  isAtEnd?: boolean;
  hasMore?: boolean;
}

export default function VideoPlayer({ 
  media, 
  isVisible, 
  onEyeClick, 
  showInfo, 
  onPrevious, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false,
  isLoadingMore = false,
  isAtEnd = false,
  hasMore = false
}: VideoPlayerProps) {
  return (
    <div className="relative w-full h-full bg-black">
      <Image
        src={media.thumbnail || media.url}
        alt={media.description || 'Media'}
        fill
        className="object-contain brightness-50 cursor-pointer"
        priority
        style={{ 
          maxHeight: '100vh',
          maxWidth: '100vw'
        }}
      />

      {!showInfo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={onEyeClick}
            className="bg-yellow-400 bg-opacity-80 rounded-full p-6 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
          >
            <Play size={40} />
          </button>
          
          {canGoPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-8 bg-yellow-400 bg-opacity-80 rounded-full p-4 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          
          {canGoNext && onNext && (
            <button
              onClick={onNext}
              className="absolute right-8 bg-yellow-400 bg-opacity-80 rounded-full p-4 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          {!canGoNext && isAtEnd && hasMore && (
            <div className="absolute right-8 bg-yellow-400 bg-opacity-80 rounded-full p-4 text-black shadow-lg z-10">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
