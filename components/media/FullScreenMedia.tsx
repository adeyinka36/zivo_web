'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Play, Pause } from 'lucide-react';
import { Media } from '../../types/media';
import { mediaService } from '../../services/media/MediaService';
import WatchNotification from '../ui/WatchNotification';
import { useAuth } from '../../context/AuthContext';

interface FullScreenMediaProps {
  media: Media;
  isOpen: boolean;
  onClose: () => void;
  onWatchComplete?: (mediaId: string) => void;
}

export default function FullScreenMedia({ media, isOpen, onClose, onWatchComplete }: FullScreenMediaProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [imageWatchTimer, setImageWatchTimer] = useState<NodeJS.Timeout | null>(null);
  const [showWatchAnimation, setShowWatchAnimation] = useState(false);
  const [showWatchNotification, setShowWatchNotification] = useState(false);
  const [isFirstTimeWatched, setIsFirstTimeWatched] = useState(!media.has_watched);

  useEffect(() => {
    if (isOpen) {
      if (media.media_type === 'video' && videoRef.current) {
        const video = videoRef.current;
        video.currentTime = 0;
        video.play().catch((error) => {});
      } else if (media.media_type === 'image') {
        const timer = setTimeout(() => {
          setShowWatchNotification(true);
          setTimeout(() => {
            handleWatchComplete();
          }, 1000);
        }, 5000);
        setImageWatchTimer(timer);
      }
    } else {
      if (imageWatchTimer) {
        clearTimeout(imageWatchTimer);
        setImageWatchTimer(null);
      }
    }

    return () => {
      if (imageWatchTimer) {
        clearTimeout(imageWatchTimer);
      }
    };
  }, [isOpen, media.media_type]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }


    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowWatchNotification(true);
      setTimeout(() => {
        handleWatchComplete();
      }, 1000);
    };

    const handleLoadStart = () => {};
    const handleLoadedData = () => {};
    const handleCanPlay = () => {};
    const handleError = (e) => {};

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [media.url]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {});
    }
  };


  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWatchComplete = async () => {
    if (!media.has_watched && user?.id) {
      try {
        const response = await mediaService.markAsWatched(media.id, user.id);
        setIsFirstTimeWatched(false);
        onWatchComplete?.(media.id);
      } catch (error) {
        console.error('Failed to mark as watched:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto">
        {media.media_type === 'video' ? (
          <div 
            className="relative w-full h-full"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={media.url}
              poster={media.thumbnail}
              className="w-full h-full object-cover"
              muted={false}
              playsInline
              preload="metadata"
              controls={false}
              onClick={togglePlay}
              style={{ 
                maxHeight: '100vh',
                maxWidth: '100vw'
              }}
            />

            {showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={togglePlay}
                  className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all pointer-events-auto"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-center text-white text-sm mb-2">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              
              <div 
                className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={media.url}
              alt={media.description || 'Media'}
              fill
              className="object-contain"
              priority
              style={{ 
                maxHeight: '100vh',
                maxWidth: '100vw'
              }}
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
        >
          <X size={24} />
        </button>

        <WatchNotification 
          isVisible={showWatchNotification}
          isFirstTime={isFirstTimeWatched}
          mediaType={media.media_type}
          hasBeenWatched={media.has_watched}
        />
      </div>
    </div>
  );
}
