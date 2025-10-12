'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { PaymentFormData, StripeError } from '../../types/payment';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentData: PaymentFormData) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentForm({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError, 
  isLoading = false 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        const errorMessage = getStripeErrorMessage(stripeError);
        setError(errorMessage);
        onError(errorMessage);
      } else if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        onSuccess({
          paymentMethodId: paymentIntent.payment_method as string,
          paymentIntentId: paymentIntent.id,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const getStripeErrorMessage = (error: StripeError): string => {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect. Please try again.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      case 'insufficient_funds':
        return 'Your card has insufficient funds. Please try a different payment method.';
      case 'payment_intent_unexpected_state':
        return 'This payment has already been processed. Please refresh the page and try again.';
      default:
        return error.message || 'Payment failed. Please try again.';
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: '#374151',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-400 rounded-lg">
          <CreditCard size={24} className="text-black" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Payment Details</h3>
          <p className="text-gray-400">Amount: ${amount.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Information
          </label>
          <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Lock size={16} />
          <span>Your payment information is secure and encrypted</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || isLoading}
          className="w-full py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
