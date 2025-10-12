'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import MediaItem from '../../components/media/MediaItem';
import FullScreenMedia from '../../components/media/FullScreenMedia';
import AuthGuard from '../../components/auth/AuthGuard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import InitialLoadingScreen from '../../components/ui/InitialLoadingScreen';
import { useInfiniteMedia } from '../../hooks/useInfiniteMedia';
import { useScrollToLoad } from '../../hooks/useScrollToLoad';
import { Media } from '@/types/media';
import { useAuth } from '../../context/AuthContext';

export default function ExplorePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  
  // Get search term from URL parameters
  const searchTerm = searchParams.get('search') || '';
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    media: mediaList,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    markMediaAsWatched,
    totalLoaded
  } = useInfiniteMedia({ perPage: 20, search: searchTerm });

  useScrollToLoad({
    currentIndex,
    totalItems: mediaList.length,
    threshold: 5,
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore
  });

  const totalItems = mediaList.length;

  // Auto-load more data when approaching the end (5 items away)
  useEffect(() => {
    if (currentIndex >= mediaList.length - 5 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [currentIndex, mediaList.length, hasMore, isLoadingMore, loadMore]);

  // Ensure currentIndex never exceeds loaded data
  useEffect(() => {
    if (currentIndex >= mediaList.length && mediaList.length > 0) {
      setCurrentIndex(mediaList.length - 1);
    }
  }, [currentIndex, mediaList.length]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Prevent scrolling beyond loaded data
      if (e.deltaY > 0 && currentIndex < mediaList.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent navigation beyond loaded data
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
    markMediaAsWatched(mediaId);
    queryClient.invalidateQueries({ 
      queryKey: ['media'],
      exact: false 
    });
  };

  if (isLoading && mediaList.length === 0) {
    return <InitialLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load videos</div>
          <div className="text-gray-400 text-sm mb-6">Please check your connection and try again</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mediaList.length && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            {searchTerm ? (
              <>
                <div className="text-white text-xl mb-4">No results found</div>
                <div className="text-gray-400 text-sm mb-6">
                  No media found for "{searchTerm}". Try a different search term.
                </div>
                <button
                  onClick={() => window.location.href = '/explore'}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <div className="text-white text-xl mb-4">No videos available</div>
                <div className="text-gray-400 text-sm mb-6">Check back later for new content</div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Refresh
                </button>
              </>
            )}
          </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      {/* Search indicator */}
      {searchTerm && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-sm">Search results for:</span>
              <span className="text-white font-medium">"{searchTerm}"</span>
            </div>
            <button
              onClick={() => window.location.href = '/explore'}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative overflow-hidden w-full"
        style={{ height: '100vh' }}
      >
          <div 
            className="transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateY(-${currentIndex * 100}vh)`,
              height: `${totalItems * 100}vh`
            }}
          >
            {mediaList.map((media, index) => (
              <MediaItem
                key={`${media.id}-${index}`}
                media={media}
                isVisible={index === currentIndex}
                onEyeClick={() => handleEyeClick(media)}
                onWatchComplete={handleWatchComplete}
                onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                onNext={() => {
                  // Only allow navigation within loaded data
                  if (currentIndex < mediaList.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                  }
                  // Note: Auto-loading is handled by useEffect above
                }}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex < mediaList.length - 1}
                isLoadingMore={isLoadingMore && hasMore && currentIndex === mediaList.length - 1}
                isAtEnd={currentIndex === mediaList.length - 1}
                hasMore={hasMore}
              />
            ))}
            
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
