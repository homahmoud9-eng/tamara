"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';

type Theme = "dark";
type Direction = "rtl" | "ltr";
type Language = "ar" | "en";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

import { t as translate, TranslationKey } from "@/lib/translations";

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: Direction;
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  t: (key: TranslationKey | string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>("ar");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Tamara',
    lastName: 'Guest',
    email: 'guest@tamarakitchen.com',
    phone: '+971 54 174 4773',
    profileImage: null
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("userProfile", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Read persisted profile
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse userProfile", e);
      }
    }

    // Read persisted theme
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState("dark");
    } else {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // Initial language apply
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang) {
      setLanguageState(savedLang);
      document.cookie = `NEXT_LOCALE=${savedLang}; path=/; max-age=31536000`; // Ensure cookie is synced on load
    } else if (navigator.language.startsWith("en")) {
      setLanguageState("en");
      document.cookie = `NEXT_LOCALE=en; path=/; max-age=31536000`;
    } else {
      document.cookie = `NEXT_LOCALE=ar; path=/; max-age=31536000`;
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("language", newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`; // Set cookie for Server Components
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const applyTheme = (currentTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", "dark");
  };

  // Sync theme changes
  useEffect(() => {
    applyTheme("dark");
  }, [theme]);

  // Initial language apply
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const t = (key: TranslationKey | string) => translate(key as any, language);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, direction, userProfile, updateProfile, t }}>
      <Toaster position="top-center" />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, direction } = useApp();
  return { t, language, direction };
}
