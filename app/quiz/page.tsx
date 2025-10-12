'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';
import CircularTimer from '../../components/quiz/CircularTimer';
import QuizQuestion from '../../components/quiz/QuizQuestion';
import QuizOptions from '../../components/quiz/QuizOptions';
import { mediaService } from '../../services/media/MediaService';
import { audioService } from '../../services/audioService';

const QUIZ_DURATION = 30;
const RESULT_DELAY = 2000;
const QUIZ_TIMEOUT = 120000;

export default function QuizPage() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correctAnswerIndex = useMemo(() => {
    const answerMap = { A: 0, B: 1, C: 2, D: 3 };
    return answerMap[quizData?.question?.answer as keyof typeof answerMap] ?? 0;
  }, [quizData?.question?.answer]);

  const options = useMemo(() => {
    if (!quizData?.question) return [];
    return [
      quizData.question.option_a,
      quizData.question.option_b,
      quizData.question.option_c,
      quizData.question.option_d,
    ];
  }, [quizData?.question]);

  useEffect(() => {
    if (!quizData) {
      router.replace('/explore');
    }
  }, [quizData, router]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      setIsTimeExpired(true);
      handleAnswerSelect(null, true);
    }
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    if (!isAnswered) {
      timeoutRef.current = setTimeout(() => {
        if (!isAnswered) {
          setIsTimeExpired(true);
          handleAnswerSelect(null, true);
        }
      }, QUIZ_TIMEOUT);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [isAnswered]);

  const handleAnswerSelect = useCallback((answerIndex: number | null, isExpired: boolean = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const isCorrect = answerIndex === correctAnswerIndex;
    
    if (isCorrect) {
      audioService.playQuizCorrect();
    } else {
      audioService.playQuizWrong();
    }
    
    handleQuizComplete(isCorrect);

    resultTimeoutRef.current = setTimeout(() => {
      const queryParams = new URLSearchParams({
        isCorrect: isCorrect.toString(),
        selectedAnswer: answerIndex?.toString() || 'none',
        correctAnswer: correctAnswerIndex.toString(),
        isTimeExpired: isExpired.toString(),
      });
      router.push(`/quiz-result?${queryParams.toString()}`);
    }, RESULT_DELAY);
  }, [isAnswered, correctAnswerIndex, router]);

  const handleQuizComplete = async (correct: boolean) => {
    try {
      if (quizData?.question?.id) {
        await mediaService.submitQuizResult({
          is_correct: correct,
          media_id: quizData.id,
        });
      }
    } catch (error) {
      console.error('Failed to send quiz result:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = null;
      }
    };
  }, []);

  if (!quizData?.question?.question) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-lg text-center">No valid quiz question available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6">
      <div className="flex-1 flex flex-col justify-center min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <QuizQuestion question={quizData.question.question} />
        </div>

        <div className="flex items-center justify-center mb-12">
          <CircularTimer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            totalTime={QUIZ_DURATION}
          />
        </div>

        <div className="mb-8">
          <QuizOptions
            options={options}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
            isAnswered={isAnswered}
            correctAnswer={correctAnswerIndex}
          />
        </div>
      </div>
    </div>
  );
}
