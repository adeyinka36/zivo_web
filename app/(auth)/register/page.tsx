'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import AuthButton from '../../../components/auth/AuthButton';
import { useAuth } from '../../../context/AuthContext';
import { registerSchema } from '../../../config/authForms';
import { z } from 'zod';

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const formValues = watch();

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    setFormError('');

    try {
      await registerUser(data);
      router.push('/explore');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthCard logoSize="medium">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <AuthInput
            name="name"
            placeholder="Full name"
            type="text"
            value={formValues.name || ''}
            onChange={(value) => setValue('name', value)}
            error={errors.name?.message}
            required
          />

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

          <AuthInput
            name="confirmPassword"
            placeholder="Confirm password"
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
            title="REGISTER"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
