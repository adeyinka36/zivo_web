'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface MediaUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export default function MediaUpload({ file, onFileSelect, error }: MediaUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('image/'))) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const removeFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  const isVideo = file?.type.startsWith('video/');
  const isImage = file?.type.startsWith('image/');

  if (file) {
    return (
      <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
        {isVideo ? (
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
            controls
          />
        ) : isImage ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : null}
        
        <button
          onClick={removeFile}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {file.name}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
          isDragOver
            ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
            : 'border-gray-600 hover:border-gray-500'
        } ${error ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-white mb-2">
            Drop your media here
          </p>
          <p className="text-gray-400 mb-4">
            or click to browse files
          </p>
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFileInput}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            Choose File
          </label>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
