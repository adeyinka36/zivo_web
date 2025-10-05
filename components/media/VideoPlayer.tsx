'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export default function VideoPlayer({ 
  media, 
  isVisible, 
  onEyeClick, 
  showInfo, 
  onPrevious, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      if (isPlaying) return;
      video.currentTime = 0;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {});
    };

    const pauseVideo = () => {
      if (!isPlaying) return;
      video.pause();
      setIsPlaying(false);
    };

    if (isVisible) {
      playVideo();
    } else {
      pauseVideo();
    }
  }, [isVisible, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (isVisible) {
        video.currentTime = 0;
        video.play().catch((error) => {});
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVisible]);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={media.url}
        poster={media.thumbnail}
        className="w-full h-full object-contain brightness-50 cursor-pointer"
        loop
        muted
        playsInline
        preload="metadata"
        autoPlay
        onError={(e) => {}}
        onClick={() => {
          setHasUserInteracted(true);
          const video = videoRef.current;
          if (video) {
            if (isPlaying) {
              video.pause();
            } else {
              video.play().catch((error) => {});
            }
          }
        }}
        style={{ 
          maxHeight: '100vh',
          maxWidth: '100vw'
        }}
      />

      {!showInfo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={() => {
              setHasUserInteracted(true);
              onEyeClick();
            }}
            className="bg-yellow-400 bg-opacity-80 rounded-full p-6 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
          >
            <Eye size={40} />
          </button>
          
          {canGoPrevious && onPrevious && (
            <button
              onClick={() => {
                setHasUserInteracted(true);
                onPrevious();
              }}
              className="absolute left-8 bg-yellow-400 bg-opacity-80 rounded-full p-4 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          
          {canGoNext && onNext && (
            <button
              onClick={() => {
                setHasUserInteracted(true);
                onNext();
              }}
              className="absolute right-8 bg-yellow-400 bg-opacity-80 rounded-full p-4 text-black hover:bg-opacity-100 transition-all pointer-events-auto shadow-lg z-10 cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
