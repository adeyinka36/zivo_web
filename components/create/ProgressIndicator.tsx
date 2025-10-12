'use client';

import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { UploadProgress } from '../../types/create';

interface ProgressIndicatorProps {
  progress: UploadProgress;
  isUploading: boolean;
  isSuccess: boolean;
  error?: string;
}

export default function ProgressIndicator({ progress, isUploading, isSuccess, error }: ProgressIndicatorProps) {
  if (!isUploading && !isSuccess && !error) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        {isSuccess ? (
          <CheckCircle size={24} className="text-green-400" />
        ) : isUploading ? (
          <Upload size={24} className="text-yellow-400 animate-pulse" />
        ) : (
          <Upload size={24} className="text-red-400" />
        )}
        
        <div className="flex-1">
          <h3 className="text-white font-medium">
            {isSuccess ? 'Upload Complete!' : isUploading ? 'Uploading...' : 'Upload Failed'}
          </h3>
          {isUploading && (
            <p className="text-gray-400 text-sm">
              {progress.percentage}% complete
            </p>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}

      {isSuccess && (
        <p className="text-green-400 text-sm">
          Your media has been uploaded successfully and is now live!
        </p>
      )}
    </div>
  );
}
