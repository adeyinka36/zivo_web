'use client';

import React from 'react';
import { X, Trophy } from 'lucide-react';

interface QuizInvitationModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  reward?: number;
}

export default function QuizInvitationModal({ isOpen, onAccept, onDecline, reward }: QuizInvitationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center">
          <div className="mb-6">
            <Trophy className="mx-auto text-yellow-400" size={64} />
          </div>

          <h2 className="text-yellow-400 text-2xl font-bold mb-4">
            Quiz Invitation!
          </h2>

          <p className="text-white text-lg mb-6 leading-6">
            Congratulations! You've been selected to participate in a quiz. 
            Answer correctly to win a reward!
          </p>

          {reward && (
            <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-yellow-400">
              <p className="text-yellow-400 text-lg font-semibold">
                Potential Reward: ${(reward / 100).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onDecline}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors"
            >
              Accept Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
