import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/entities';
import { getStoredToken, setStoredToken } from '@/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const bootstrap = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.me();
      setUser(data.user);
      setProfile(data.profile);
      setAuthError(null);
    } catch (error) {
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      if (error.status === 401) {
        setAuthError({ type: 'auth_required' });
      } else {
        setAuthError({ type: 'bootstrap_failed' });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const value = useMemo(() => ({
    user,
    profile,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isFamily: profile?.identity_type === 'family',
    hasProfile: Boolean(profile?.setup_complete),
    isBlocked: Boolean(user?.is_blocked),
    refresh: bootstrap,
    login: async (email, role) => {
      const data = await authApi.login(email, role);
      setStoredToken(data.token);
      setUser(data.user);
      setAuthError(null);
      await bootstrap();
      return data.user;
    },
    logout: async () => {
      try {
        await authApi.logout();
      } catch {
        // ignore logout failures for local cleanup
      }
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      setAuthError({ type: 'auth_required' });
    },
    setProfileState: setProfile,
  }), [user, profile, isLoading, authError, bootstrap]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
