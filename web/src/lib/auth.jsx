import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/entities';
import { getStoredToken, setStoredToken } from '@/api/client';
import {
  clearMockSession,
  isMockAuthEnabled,
  isMockToken,
  loadMockSession,
  mockLogin,
  mockMe,
} from '@/lib/mockAuth';

const AuthContext = createContext(null);

function normalizeProfile(profile) {
  if (!profile) return null;
  return { ...profile, setup_complete: Boolean(profile.setup_complete) };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const applySession = useCallback((session) => {
    const nextProfile = normalizeProfile(session?.profile);
    setUser(session?.user ?? null);
    setProfile(nextProfile);
    setAuthError(null);
    return {
      user: session?.user ?? null,
      profile: nextProfile,
      hasProfile: Boolean(nextProfile?.setup_complete),
    };
  }, []);

  const bootstrap = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return null;
    }

    if (isMockAuthEnabled() && isMockToken(token)) {
      const mockSession = mockMe(token) || loadMockSession();
      if (mockSession) {
        const session = applySession({
          user: mockSession.user,
          profile: mockSession.profile,
        });
        setIsLoading(false);
        return session;
      }
      setStoredToken(null);
      clearMockSession();
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return null;
    }

    try {
      const data = await authApi.me();
      const session = applySession({
        user: data.user,
        profile: data.profile,
      });
      return session;
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
  }, [applySession]);

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
      if (isMockAuthEnabled()) {
        const session = mockLogin(email, password);
        setStoredToken(session.token);
        return applySession(session);
      }

      const data = await authApi.login(email, password);
      setStoredToken(data.token);
      setAuthError(null);
      const session = await bootstrap();
      return session || { user: data.user, profile: null, hasProfile: false };
    },
    register: async (email, password) => {
      if (isMockAuthEnabled()) {
        const session = mockLogin(email, password, { completeProfile: false });
        setStoredToken(session.token);
        return applySession(session);
      }

      const data = await authApi.register(email, password);
      setStoredToken(data.token);
      setAuthError(null);
      const session = await bootstrap();
      return session || { user: data.user, profile: null, hasProfile: false };
    },
    logout: async () => {
      const token = getStoredToken();
      if (!isMockToken(token)) {
        try {
          await authApi.logout();
        } catch {
          // ignore logout failures for local cleanup
        }
      }
      clearMockSession();
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      setAuthError({ type: 'auth_required' });
    },
    setProfileState: setProfile,
  }), [user, profile, isLoading, authError, bootstrap, applySession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
