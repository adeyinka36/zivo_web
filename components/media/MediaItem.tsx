'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Info, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import MediaInfo from './MediaInfo';
import { Media } from '../../types/media';

interface MediaItemProps {
  media: Media;
  isVisible: boolean;
  onEyeClick: () => void;
  onWatchComplete?: (mediaId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export default function MediaItem({ 
  media, 
  isVisible, 
  onEyeClick, 
  onWatchComplete, 
  onPrevious, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false 
}: MediaItemProps) {
  const [showInfo, setShowInfo] = useState(false);
  const isVideo = media.media_type === 'video';

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {isVideo ? (
        <VideoPlayer
          media={media}
          isVisible={isVisible}
          onEyeClick={onEyeClick}
          showInfo={showInfo}
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      ) : (
        <div className="relative w-full h-full max-w-full max-h-full">
          <Image
            src={media.url}
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
                <Eye size={40} />
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
            </div>
          )}
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-yellow-400">
        <p className="text-lg font-semibold">
          @{media.uploader?.username || media.uploader_username || 'unknown'}
        </p>
      </div>

      {media.has_watched && (
        <div className="absolute top-6 right-6 bg-yellow-400 bg-opacity-90 text-black p-3 rounded-full shadow-lg">
          <Check size={24} />
        </div>
      )}

      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute bottom-6 right-6 bg-yellow-400 bg-opacity-80 text-black p-4 rounded-full hover:bg-opacity-100 transition-all shadow-lg cursor-pointer"
      >
        <Info size={32} />
      </button>

      {showInfo && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <MediaInfo media={media} onClose={() => setShowInfo(false)} />
        </div>
      )}
    </div>
  );
}
