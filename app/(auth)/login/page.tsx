'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import AuthButton from '../../../components/auth/AuthButton';
import { useAuth } from '../../../context/AuthContext';
import { loginSchema } from '../../../config/authForms';
import { z } from 'zod';

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const formValues = watch();

  const onSubmit = async (data: LoginForm) => {
    clearError();
    setFormError('');

    try {
      await login(data);
      router.push('/explore');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthCard logoSize="large">
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

          <AuthInput
            name="password"
            placeholder="Password"
            type="password"
            value={formValues.password || ''}
            onChange={(value) => setValue('password', value)}
            error={errors.password?.message}
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
            title="LOGIN"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-gray-400 text-sm font-semibold hover:text-white transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
