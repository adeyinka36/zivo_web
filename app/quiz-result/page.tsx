'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';
import QuizResultModal from '../../components/quiz/QuizResultModal';
import { audioService } from '../../services/audioService';

export default function QuizResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { quizData, clearQuiz } = useQuiz();

  const isCorrect = searchParams.get('isCorrect') === 'true';
  const selectedAnswer = parseInt(searchParams.get('selectedAnswer') || '-1');
  const correctAnswer = parseInt(searchParams.get('correctAnswer') || '0');
  const isTimeExpired = searchParams.get('isTimeExpired') === 'true';

  useEffect(() => {
    if (isCorrect) {
      audioService.playQuizWon();
    } else {
      audioService.playQuizLoss();
    }
  }, [isCorrect]);

  const handleClose = () => {
    clearQuiz();
    router.replace('/explore');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <QuizResultModal
        isOpen={true}
        isCorrect={isCorrect}
        reward={quizData?.reward}
        onClose={handleClose}
      />
    </div>
  );
}
