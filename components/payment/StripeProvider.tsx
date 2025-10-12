'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RcORgQNQzgpRy5D5AV81esv2BFmR8iHf6ZlOWYboI0QKojynk9k4orPv6o9HePTYUblRw33GpIiHCsSCTxdmi8R00pgai0vOe');

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  if (!clientSecret) {
    return <div className="text-red-400">Payment not initialized</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#fbbf24',
        colorBackground: '#111827',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#374151',
          border: '1px solid #4b5563',
          color: '#ffffff',
        },
        '.Input:focus': {
          borderColor: '#fbbf24',
          boxShadow: '0 0 0 1px #fbbf24',
        },
        '.Label': {
          color: '#d1d5db',
        },
        '.Error': {
          color: '#ef4444',
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
