'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mediaService } from '../services/media/MediaService';
import { Media } from '../types/media';

interface UseInfiniteMediaProps {
  initialPage?: number;
  perPage?: number;
  search?: string;
}

export function useInfiniteMedia({ 
  initialPage = 1, 
  perPage = 20,
  search = ''
}: UseInfiniteMediaProps = {}) {
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['media', { page: currentPage, per_page: perPage, search }],
    queryFn: () => mediaService.getMedia({ page: currentPage, per_page: perPage, search }),
    enabled: hasMore,
  });

  useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllMedia(data.data);
      } else {
        setAllMedia(prev => {
          const existingIds = new Set(prev.map(media => media.id));
          const newMedia = data.data.filter(media => !existingIds.has(media.id));
          return [...prev, ...newMedia];
        });
      }
      setHasMore(data.meta.current_page < data.meta.last_page);
      setIsLoadingMore(false);
    }
  }, [data, currentPage, perPage]);

  // Reset media when search term changes
  useEffect(() => {
    setAllMedia([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [search, initialPage]);

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, isLoadingMore, isLoading]);

  const reset = useCallback(() => {
    setAllMedia([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setIsLoadingMore(false);
    refetch();
  }, [initialPage, refetch]);

  const markMediaAsWatched = useCallback((mediaId: string) => {
    setAllMedia(prev => 
      prev.map(media => 
        media.id === mediaId 
          ? { ...media, has_watched: true }
          : media
      )
    );
  }, []);

  return {
    media: allMedia,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    reset,
    markMediaAsWatched,
    totalLoaded: allMedia.length
  };
}
