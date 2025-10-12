import { ApiClient } from './api/ApiClient';
import { PaymentMetadata, PaymentIntentResponse, UploadAfterPaymentRequest, PaymentStatus } from '../types/payment';

const apiClient = new ApiClient();

export class PaymentService {
  static async createPaymentIntent(metadata: PaymentMetadata): Promise<PaymentIntentResponse> {
    try {
      const response = await apiClient.post('/media/payment-intent', metadata);
      const result = response.data.payment_intent || response.data;
      return result;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  }

  static async uploadAfterPayment(request: UploadAfterPaymentRequest): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('payment_id', request.payment_id);
      formData.append('file', request.file);
      formData.append('description', request.description);
      
      // Send tags as individual form fields like mobile app
      request.tags.forEach(tag => formData.append('tags[]', tag));
      formData.append('reward', request.reward.toString()); // Keep as cents
      formData.append('quiz_number', Math.max(1, request.quiz_number).toString());
      
      // Send questions as individual form fields like mobile app
      request.questions.forEach((question, index) => {
        formData.append(`questions[${index}][question]`, question.question);
        formData.append(`questions[${index}][answer]`, question.answer);
        formData.append(`questions[${index}][option_a]`, question.option_a);
        formData.append(`questions[${index}][option_b]`, question.option_b);
        formData.append(`questions[${index}][option_c]`, question.option_c);
        formData.append(`questions[${index}][option_d]`, question.option_d);
      });

      const response = await apiClient.post('/media/upload-after-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload media after payment');
    }
  }

  static async pollPaymentStatus(paymentId: string, maxAttempts: number = 30, interval: number = 2000): Promise<PaymentStatus> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await this.getPaymentStatus(paymentId);
        
        if (status.status === 'succeeded' || status.status === 'failed' || status.status === 'canceled') {
          return status;
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        console.error(`Payment status polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('Payment status polling timeout');
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }

  static convertToPaymentMetadata(formData: {
    description: string;
    tags: string[];
    reward: number;
    quiz: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
    quiz_number: number;
  }): PaymentMetadata {
    return {
      description: formData.description,
      tags: formData.tags,
      reward: Math.round(formData.reward * 100), // Convert dollars to cents
      quiz_number: formData.quiz_number,
      questions: formData.quiz.map(q => ({
        question: q.question,
        answer: String.fromCharCode(65 + q.correctAnswer), // Convert index to letter (A, B, C, D)
        option_a: q.options[0] || '',
        option_b: q.options[1] || '',
        option_c: q.options[2] || '',
        option_d: q.options[3] || '',
      }))
    };
  }
}
