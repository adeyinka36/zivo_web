export interface PaymentIntent {
  client_secret: string;
  payment_id: string;
  existing?: boolean;
}

export interface PaymentStatus {
  payment_id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  amount: number;
  currency: string;
  paid_at?: string;
  failure_reason?: string;
}

export interface PaymentMetadata {
  description: string;
  tags: string[];
  reward: number;
  quiz_number: number;
  questions: Array<{
    question: string;
    answer: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }>;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_id: string;
  existing: boolean;
}

export interface UploadAfterPaymentRequest {
  payment_id: string;
  file: File;
  description: string;
  tags: string[];
  reward: number;
  quiz_number: number;
  questions: Array<{
    question: string;
    answer: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }>;
}

export interface PaymentFormData {
  paymentMethodId: string;
  paymentIntentId: string;
}

export interface StripeError {
  type: string;
  code?: string;
  message: string;
  decline_code?: string;
}
