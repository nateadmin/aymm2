import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  email: 'demo@aymm.test',
  displayName: 'Demo User',
  role: 'user',
  identityType: 'individual',
  hasProfile: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isFamily: user?.identityType === 'family',
    login: (overrides = {}) => {
      setIsLoading(true);
      setUser({ ...DEFAULT_USER, ...overrides });
      setIsLoading(false);
    },
    logout: () => {
      setUser(null);
    },
    setIdentityType: (identityType) => {
      setUser((current) => (current ? { ...current, identityType } : current));
    },
    setRole: (role) => {
      setUser((current) => (current ? { ...current, role } : current));
    },
    setHasProfile: (hasProfile) => {
      setUser((current) => (current ? { ...current, hasProfile } : current));
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
