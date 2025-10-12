'use client';

import React from 'react';

interface QuizQuestionProps {
  question: string;
}

export default function QuizQuestion({ question }: QuizQuestionProps) {
  return (
    <div className="flex items-center justify-center">
      <h2 className="text-yellow-400 text-xl font-bold text-center leading-8 mb-4">
        {question}
      </h2>
    </div>
  );
}
