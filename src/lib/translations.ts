import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

export type Language = 'ar' | 'en';

export const dictionaries = {
  ar,
  en,
};

export type TranslationKey = keyof typeof ar | keyof typeof en;

export function t(key: TranslationKey, lang: Language = 'ar'): string {
  const dict = dictionaries[lang] || dictionaries.ar;
  return (dict as Record<string, string>)[key] || key;
}
