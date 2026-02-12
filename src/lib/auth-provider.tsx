'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from './supabase-client';
import { AuthUser } from './types';
import { getCurrentUser, signIn as signInService, signOut as signOutService, signUp as signUpService } from './auth-service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isHelper: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await signInService(email, password);

    if (error) {
      return { error };
    }

    if (data) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await signUpService(email, password, displayName);

    if (error) {
      return { error };
    }

    if (data) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }

    return { error: null };
  };

  const signOut = async () => {
    await signOutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isHelper: user?.is_helper || false,
        isAdmin: user?.is_admin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
