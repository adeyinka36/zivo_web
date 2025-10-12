'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CreditCard } from 'lucide-react';
import AuthGuard from '../../components/auth/AuthGuard';
import MediaUpload from '../../components/create/MediaUpload';
import QuizSection from '../../components/create/QuizSection';
import QuizNumberInput from '../../components/create/QuizNumberInput';
import RewardInput from '../../components/create/RewardInput';
import TagsInput from '../../components/create/TagsInput';
import PaymentModal from '../../components/payment/PaymentModal';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { PaymentService } from '../../services/paymentService';
import { CreateMediaForm, QuizQuestion } from '../../types/create';
import { PaymentFormData } from '../../types/payment';

export default function CreatePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateMediaForm>({
    file: null,
    description: '',
    reward: 5,
    tags: [],
    quiz: [],
    quiz_number: Math.floor(Math.random() * 100) + 1 // Random number between 1-100
  });

  const [errors, setErrors] = useState<Partial<CreateMediaForm>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateMediaForm> = {};

    if (!formData.file) {
      newErrors.file = 'Please select a media file';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (formData.reward < 1) {
      newErrors.reward = 'Reward must be at least $1.00';
    } else if (formData.reward < 5) {
      newErrors.reward = 'Reward must be at least $5.00';
    } else if (formData.reward.toString().startsWith('0.')) {
      newErrors.reward = 'Reward cannot start with 0 (e.g., 0.50). Minimum is $1.00';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (isProcessingPayment || paymentCompleted) {
      return; // Prevent duplicate submissions
    }

    setIsProcessingPayment(true);

    try {
      const metadata = PaymentService.convertToPaymentMetadata({
        description: formData.description,
        tags: formData.tags,
        reward: formData.reward,
        quiz: formData.quiz,
        quiz_number: formData.quiz_number
      });

      const paymentResult = await PaymentService.createPaymentIntent(metadata);
      setPaymentClientSecret(paymentResult.client_secret);
      setPaymentId(paymentResult.payment_id);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      const errorMessage = error.message || 'Failed to create payment intent';
      
      if (errorMessage.includes('already been completed')) {
        alert('This media has already been paid for. Please refresh the page and try creating new content.');
        // Reset form to allow new creation
        setFormData({
          file: null,
          description: '',
          tags: [],
          reward: 5,
          quiz: []
        });
        setErrors({});
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: PaymentFormData) => {
    if (!formData.file) {
      alert('No file selected');
      return;
    }

    if (paymentCompleted) {
      return; // Prevent duplicate processing
    }

    setPaymentCompleted(true);
    setIsLoading(true);
    setLoadingMessage('Verifying payment...');

    try {
      // Poll payment status like zivo_app does
      const status = await PaymentService.pollPaymentStatus(paymentId);
      
      if (status.status === 'succeeded') {
        setLoadingMessage('Uploading media...');
        await uploadMediaAfterPayment();
      } else {
        setIsLoading(false);
        alert(status.failure_reason || 'Payment was not completed');
      }
    } catch (pollError) {
      console.error('Payment status polling failed:', pollError);
      setIsLoading(false);
      alert('Payment completed but status verification failed. Please check your payment history.');
    }
  };

  const uploadMediaAfterPayment = async () => {
    try {
      const uploadRequest = {
        payment_id: paymentId,
        file: formData.file,
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

      await PaymentService.uploadAfterPayment(uploadRequest);
      
      setIsLoading(false);
      setShowPaymentModal(false);
      
      // Auto-refresh explore page by navigating to it
      // The explore page will automatically show the new media at the top
      router.push('/explore');
    } catch (error: any) {
      console.error('Upload after payment error:', error);
      setIsLoading(false);
      alert(error.message || 'Failed to upload media after payment');
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(error);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentClientSecret('');
    setPaymentId('');
    setPaymentCompleted(false);
    setIsProcessingPayment(false);
  };

  const updateFormData = (updates: Partial<CreateMediaForm>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const addQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    updateFormData({ quiz: [...formData.quiz, newQuestion] });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-white">Create Content</h1>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Media Upload</h2>
              <MediaUpload
                file={formData.file}
                onFileSelect={(file) => updateFormData({ file })}
                error={errors.file}
              />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Content Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe your content..."
                    rows={4}
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <RewardInput
                  value={formData.reward}
                  onChange={(reward) => updateFormData({ reward })}
                  error={errors.reward}
                />

                <TagsInput
                  tags={formData.tags}
                  onTagsChange={(tags) => updateFormData({ tags })}
                  error={errors.tags}
                />
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <QuizSection
                questions={formData.quiz}
                onQuestionsChange={(quiz) => updateFormData({ quiz })}
              />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <QuizNumberInput
                value={formData.quiz_number}
                onChange={(quiz_number) => updateFormData({ quiz_number })}
                error={errors.quiz_number}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay & Upload
                  </>
                )}
              </button>
            </div>
          </div>

          {showPaymentModal && (
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={handleClosePaymentModal}
              clientSecret={paymentClientSecret}
              amount={formData.reward}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isLoading={isProcessingPayment}
            />
          )}

          <LoadingOverlay isVisible={isLoading} message={loadingMessage} />
        </div>
      </div>
    </AuthGuard>
  );
}