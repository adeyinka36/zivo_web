'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../services/api/ApiClient';
import { CreateMediaForm, CreateMediaResponse, UploadProgress } from '../types/create';

const apiClient = new ApiClient();

export function useCreateMedia() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0
  });
  
  const queryClient = useQueryClient();

  const uploadMedia = useMutation({
    mutationFn: async (formData: CreateMediaForm): Promise<CreateMediaResponse> => {
      if (!formData.file) {
        throw new Error('No file selected');
      }

      const data = new FormData();
      data.append('file', formData.file);
      data.append('description', formData.description);
      data.append('reward', formData.reward.toString());
      data.append('tags', JSON.stringify(formData.tags));
      
      if (formData.quiz.length > 0) {
        data.append('quiz', JSON.stringify(formData.quiz));
      }

      const response = await apiClient.post('/media/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage
            });
          }
        }
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    },
    onError: () => {
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    }
  });

  const resetProgress = useCallback(() => {
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
  }, []);

  return {
    uploadMedia: uploadMedia.mutate,
    isLoading: uploadMedia.isPending,
    error: uploadMedia.error,
    uploadProgress,
    resetProgress,
    isSuccess: uploadMedia.isSuccess
  };
}
