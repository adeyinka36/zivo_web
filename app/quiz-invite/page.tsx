'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';
import QuizInvitationModal from '../../components/quiz/QuizInvitationModal';
import { audioService } from '../../services/audioService';

export default function QuizInvitePage() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();

  useEffect(() => {
    if (!quizData) {
      router.replace('/explore');
    } else {
      audioService.playQuizNotification();
    }
  }, [quizData, router]);

  const handleAccept = () => {
    if (quizData?.question) {
      router.push('/quiz');
    }
  };

  const handleDecline = () => {
    clearQuiz();
    router.replace('/explore');
  };

  if (!quizData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <QuizInvitationModal
        isOpen={true}
        onAccept={handleAccept}
        onDecline={handleDecline}
        reward={quizData.reward}
      />
    </div>
  );
}
