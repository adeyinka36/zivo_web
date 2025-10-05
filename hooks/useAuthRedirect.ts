'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push('/login');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [router]);
};
