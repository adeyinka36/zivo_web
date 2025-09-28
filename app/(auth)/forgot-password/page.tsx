'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import AuthButton from '../../../components/auth/AuthButton';
import { useAuth } from '../../../context/AuthContext';
import { resetPasswordSchema } from '../../../config/authForms';
import { z } from 'zod';

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const formValues = watch();

  const onSubmit = async (data: ResetPasswordForm) => {
    clearError();
    setFormError('');

    try {
      await forgotPassword(data);
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <AuthInput
            name="email"
            placeholder="Email address"
            type="email"
            value={formValues.email || ''}
            onChange={(value) => setValue('email', value)}
            error={errors.email?.message}
            required
          />

          {(error || formError) && (
            <div className="mb-4">
              <p className="text-red-400 text-sm text-center">
                {error?.message || formError}
              </p>
            </div>
          )}

          <AuthButton
            title="SEND RESET LINK"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
