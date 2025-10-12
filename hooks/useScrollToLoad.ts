'use client';

import { useEffect, useCallback } from 'react';

interface UseScrollToLoadProps {
  currentIndex: number;
  totalItems: number;
  threshold?: number;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function useScrollToLoad({
  currentIndex,
  totalItems,
  threshold = 3,
  onLoadMore,
  hasMore,
  isLoading
}: UseScrollToLoadProps) {
  const shouldLoadMore = useCallback(() => {
    return currentIndex >= totalItems - threshold && hasMore && !isLoading;
  }, [currentIndex, totalItems, threshold, hasMore, isLoading]);

  useEffect(() => {
    if (shouldLoadMore()) {
      onLoadMore();
    }
  }, [shouldLoadMore, onLoadMore]);

  return {
    shouldLoadMore: shouldLoadMore()
  };
}
