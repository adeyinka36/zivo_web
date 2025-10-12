export interface CreateMediaForm {
  file: File | null;
  description: string;
  reward: number;
  tags: string[];
  quiz: QuizQuestion[];
  quiz_number: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CreateMediaResponse {
  success: boolean;
  data?: {
    id: string;
    url: string;
    quiz_id?: string;
  };
  error?: string;
}

