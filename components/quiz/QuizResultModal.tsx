'use client';

import React from 'react';
import { CheckCircle, XCircle, Home } from 'lucide-react';

interface QuizResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  reward?: number;
  onClose: () => void;
}

export default function QuizResultModal({ isOpen, isCorrect, reward, onClose }: QuizResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-6">
            {isCorrect ? (
              <CheckCircle className="mx-auto text-green-400" size={80} />
            ) : (
              <XCircle className="mx-auto text-red-500" size={80} />
            )}
          </div>

          <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-500'}`}>
            {isCorrect ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h2>

          <p className="text-white text-lg mb-6 leading-6">
            {isCorrect 
              ? 'You answered correctly! Your knowledge is impressive.'
              : 'That was a tricky question. Keep watching for more opportunities!'
            }
          </p>

          {isCorrect && reward && (
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-yellow-400">
              <p className="text-yellow-400 text-lg font-semibold">
                You earned ${(reward / 100).toFixed(2)} in AWS voucher!
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-yellow-400 text-black rounded-xl py-4 px-8 font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
