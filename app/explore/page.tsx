'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar';
import MediaItem from '../../components/media/MediaItem';
import FullScreenMedia from '../../components/media/FullScreenMedia';
import AuthGuard from '../../components/auth/AuthGuard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mediaService } from '@/services/media/MediaService';
import { Media } from '@/types/media';
import { useAuth } from '../../context/AuthContext';

export default function ExplorePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  const { data: mediaData, isLoading, error } = useQuery({
    queryKey: ['media', { page: 1, per_page: 20 }],
    queryFn: () => mediaService.getMedia({ page: 1, per_page: 20 }),
  });

  useEffect(() => {
    if (mediaData?.data) {
      setMediaList(mediaData.data);
    }
  }, [mediaData]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0 && currentIndex < mediaList.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < mediaList.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'Escape' && isFullScreenOpen) {
        handleCloseFullScreen();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, mediaList.length, isFullScreenOpen]);

  const handleEyeClick = (media: Media) => {
    setSelectedMedia(media);
    setIsFullScreenOpen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenOpen(false);
    setSelectedMedia(null);
  };

  const handleWatchComplete = (mediaId: string) => {
    setMediaList(prev => prev.map(media => 
      media.id === mediaId ? { ...media, has_watched: true } : media
    ));
    
    queryClient.invalidateQueries({ queryKey: ['media'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading media..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading media</div>
      </div>
    );
  }

  if (!mediaList.length) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">No media found</div>
            <div className="text-gray-400">Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div className="text-gray-400">Error: {error ? 'Yes' : 'No'}</div>
            <div className="text-gray-400">Media data: {mediaData ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex flex-col lg:flex-row">
        <Sidebar />
        
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden w-full"
          style={{ height: '100vh' }}
        >
          <div 
            className="transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateY(-${currentIndex * 100}vh)`,
              height: `${mediaList.length * 100}vh`
            }}
          >
            {mediaList.map((media, index) => (
              <MediaItem
                key={media.id}
                media={media}
                isVisible={index === currentIndex}
                onEyeClick={() => handleEyeClick(media)}
                onWatchComplete={handleWatchComplete}
                onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                onNext={() => setCurrentIndex(prev => Math.min(mediaList.length - 1, prev + 1))}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex < mediaList.length - 1}
              />
            ))}
          </div>

        </div>

        {selectedMedia && (
          <FullScreenMedia
            media={selectedMedia}
            isOpen={isFullScreenOpen}
            onClose={handleCloseFullScreen}
            onWatchComplete={handleWatchComplete}
          />
        )}
      </div>
    </AuthGuard>
  );
}
