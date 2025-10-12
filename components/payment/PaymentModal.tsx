'use client';

import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import StripeProvider from './StripeProvider';
import PaymentForm from './PaymentForm';
import { PaymentFormData } from '../../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  amount: number;
  onPaymentSuccess: (paymentData: PaymentFormData) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  clientSecret,
  amount,
  onPaymentSuccess,
  onPaymentError,
  isLoading = false
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              clientSecret={clientSecret}
              amount={amount}
              onSuccess={onPaymentSuccess}
              onError={onPaymentError}
              isLoading={isLoading}
            />
          </StripeProvider>
        </div>
      </div>
    </div>
  );
}
