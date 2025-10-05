'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Media } from '@/types/media';

interface MediaInfoProps {
  media: Media;
  onClose: () => void;
}

export default function MediaInfo({ media, onClose }: MediaInfoProps) {
  const formatReward = (reward?: number) => {
    if (!reward) return '0.00';
    return (reward / 100).toFixed(2);
  };

  return (
    <div className="bg-black bg-opacity-95 rounded-xl p-6 border border-yellow-400 border-opacity-30 max-h-[90%] min-h-[400px] min-w-[30rem] max-w-[45vw] mx-auto relative flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-yellow-400 font-bold text-xl">Media Details</h2>
        <button
          onClick={onClose}
          className="bg-yellow-400 bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-all"
        >
          <X className="text-black" size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="w-full max-h-[400px] overflow-y-auto scrollbar-hide">
          {/* Description */}
          <div className="mb-6">
            <p className="text-white leading-6 font-medium text-base">
              {media.description || 'No description available'}
            </p>
          </div>

          {/* Prominent Reward Section */}
          <div className="bg-yellow-400 bg-opacity-30 rounded-xl p-5 mb-6 border-2 border-yellow-400 min-h-[80px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-black font-bold text-2xl mb-2">
                ${formatReward(media.reward)}
              </div>
              <div className="text-black font-semibold text-sm">
                AWS Voucher Reward
              </div>
            </div>
          </div>

          {/* Uploader Info */}
          <div className="mb-6 bg-black rounded-xl p-2">
            <div className="text-yellow-400 font-semibold mb-2 text-sm">
              Uploader:  {media.uploader?.username || media.uploader_username || 'Unknown'}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="text-yellow-400 font-semibold mb-3 text-sm">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {media.tags && media.tags.length > 0 ? (
                media.tags.map((tag, index) => {
                  const tagName = typeof tag === 'string' ? tag : tag.name || tag.slug || 'tag';
                  return (
                    <span
                      key={index}
                      className="bg-yellow-400 bg-opacity-30 border border-yellow-400 border-opacity-50 rounded-full px-4 py-2"
                    >
                      <span className="text-black font-medium text-xs">
                        #{tagName}
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-300 text-xs italic">
                  No tags available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
