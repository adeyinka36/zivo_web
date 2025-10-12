'use client';

import React from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { QuizQuestion } from '../../types/create';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onQuestionsChange: (questions: QuizQuestion[]) => void;
}

export default function QuizSection({ questions, onQuestionsChange }: QuizSectionProps) {
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    onQuestionsChange(
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Quiz Questions</h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No quiz questions added yet.</p>
          <p className="text-sm">Add questions to create an interactive quiz for your media.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">Question {index + 1}</h4>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            question.correctAnswer === optionIndex
                              ? 'border-yellow-400 bg-yellow-400'
                              : 'border-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {question.correctAnswer === optionIndex && (
                            <Check size={12} className="text-black" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
