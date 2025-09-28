'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import AuthButton from '../../../components/auth/AuthButton';
import { useAuth } from '../../../context/AuthContext';
import { newPasswordSchema } from '../../../config/authForms';
import { z } from 'zod';

type NewPasswordForm = z.infer<typeof newPasswordSchema>;

export default function ResetPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string>('');

  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
  });

  const formValues = watch();

  const onSubmit = async (data: NewPasswordForm) => {
    if (!email) {
      setFormError('Invalid reset link. Please request a new password reset link.');
      return;
    }

    clearError();
    setFormError('');

    try {
      await resetPassword({
        ...data,
        email,
      });
      router.push('/login?message=Password reset successful. Please login with your new password.');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <AuthInput
            name="token"
            placeholder="Enter token from email"
            type="text"
            value={formValues.token || ''}
            onChange={(value) => setValue('token', value)}
            error={errors.token?.message}
            required
          />

          <AuthInput
            name="password"
            placeholder="New password"
            type="password"
            value={formValues.password || ''}
            onChange={(value) => setValue('password', value)}
            error={errors.password?.message}
            required
          />

          <AuthInput
            name="confirmPassword"
            placeholder="Confirm new password"
            type="password"
            value={formValues.confirmPassword || ''}
            onChange={(value) => setValue('confirmPassword', value)}
            error={errors.confirmPassword?.message}
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
            title="RESET PASSWORD"
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
