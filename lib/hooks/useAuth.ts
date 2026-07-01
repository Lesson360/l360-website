'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api/auth';
import { User } from '@/lib/api/types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await authApi.getProfile();
      setUser(response.data.user);
    } catch (error) {
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { token, user } = response.data;
    Cookies.set('token', token, { expires: 7 });
    setUser(user);
    return response;
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const registerUser = useCallback(async (data: any) => {
    const response = await authApi.register(data);
    return response;
  }, []);

  const verifyOTP = useCallback(async (phoneNumber: string, otp: string) => {
    const response = await authApi.verifyOTP({ phoneNumber, otp });
    const { token, user } = response.data;
    Cookies.set('token', token, { expires: 7 });
    setUser(user);
    return response;
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    registerUser,
    verifyOTP,
    getUser,
  };
}