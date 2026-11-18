'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language } from '@/types';
import thDict from '../../public/locales/th.json';
import enDict from '../../public/locales/en.json';

interface LanguageContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const dictionaries: Record<Language, any> = {
  th: thDict,
  en: enDict,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('th');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('paws_lang') as Language;
      if (saved && (saved === 'th' || saved === 'en')) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore private browsing storage errors
    }
  }, []);

  const setLocale = useCallback((lang: Language) => {
    setLocaleState(lang);
    try {
      localStorage.setItem('paws_lang', lang);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.lang = lang;
  }, []);

  /**
   * Helper to get deeply nested translation strings: e.g. t('landing.heroTitle')
   */
  const t = useCallback((keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let current = dictionaries[locale] || dictionaries.th;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if not found in current locale
        let fbCurrent = dictionaries.en;
        for (const fbKey of keys) {
          if (fbCurrent && typeof fbCurrent === 'object' && fbKey in fbCurrent) {
            fbCurrent = fbCurrent[fbKey];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fbCurrent === 'string' ? fbCurrent : fallback || keyPath;
      }
    }

    return typeof current === 'string' ? current : fallback || keyPath;
  }, [locale]);

  const contextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
