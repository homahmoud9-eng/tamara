"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type Direction = "rtl" | "ltr";
type Language = "ar" | "en";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: Direction;
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
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
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(savedTheme);
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
    if (currentTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }
  };

  // Sync theme changes with system preference if set to system
  useEffect(() => {
    applyTheme(theme);
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Initial language apply
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, direction, userProfile, updateProfile }}>
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
