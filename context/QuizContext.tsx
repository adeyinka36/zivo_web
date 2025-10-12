'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MediaWithQuestion {
  id: string;
  name: string;
  file_name: string;
  mime_type: string;
  url: string;
  media_type: 'video' | 'image';
  description: string;
  reward: number;
  uploader_id: string;
  uploader_username: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  view_count: number;
  created_at: string;
  updated_at: string;
  has_watched: boolean;
  quiz_number: number;
  question: {
    id: string;
    question: string;
    answer: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  };
}

interface QuizContextType {
  quizData: MediaWithQuestion | null;
  setQuizData: (data: MediaWithQuestion | null) => void;
  clearQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizData, setQuizData] = useState<MediaWithQuestion | null>(null);

  const clearQuiz = () => {
    setQuizData(null);
  };

  return (
    <QuizContext.Provider value={{ quizData, setQuizData, clearQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
