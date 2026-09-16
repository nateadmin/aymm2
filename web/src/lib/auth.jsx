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
      return null;
    }

    try {
      const data = await authApi.me();
      const nextProfile = data.profile
        ? { ...data.profile, setup_complete: Boolean(data.profile.setup_complete) }
        : null;
      setUser(data.user);
      setProfile(nextProfile);
      setAuthError(null);
      return { user: data.user, profile: nextProfile, hasProfile: Boolean(nextProfile?.setup_complete) };
    } catch (error) {
      if (error.status === 401) {
        setStoredToken(null);
        setUser(null);
        setProfile(null);
        setAuthError({ type: 'auth_required' });
      } else {
        setAuthError({ type: 'bootstrap_failed' });
      }
      return null;
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
    login: async (email, password) => {
      const data = await authApi.login(email, password);
      setStoredToken(data.token);
      setUser(data.user);
      setAuthError(null);
      const session = await bootstrap();
      return session || { user: data.user, profile: null, hasProfile: false };
    },
    register: async (email, password) => {
      const data = await authApi.register(email, password);
      setStoredToken(data.token);
      setUser(data.user);
      setAuthError(null);
      const session = await bootstrap();
      return session || { user: data.user, profile: null, hasProfile: false };
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
