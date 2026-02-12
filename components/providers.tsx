'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n-config';
import { AuthProvider } from '@/lib/auth-provider';
import { setupMobileOptimizations } from '@/lib/mobile-utils';

const SUPPORTED_LANGUAGES = ['en', 'de', 'fr'];

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = setupMobileOptimizations();
    return cleanup;
  }, []);

  useEffect(() => {
    // After hydration, detect the user's preferred language from localStorage or browser settings
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('i18nextLng');
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      i18n.changeLanguage(stored);
      return;
    }

    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
      i18n.changeLanguage(browserLang);
    }
  }, []);

  // Persist language changes to localStorage
  useEffect(() => {
    const handler = (lng: string) => {
      localStorage.setItem('i18nextLng', lng);
    };
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nextProvider>
  );
}
