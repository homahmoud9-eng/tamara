import { cookies } from 'next/headers';

export type Language = 'ar' | 'en';

export async function getAdminLang(): Promise<Language> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  
  if (locale === 'en') {
    return 'en';
  }
  
  // Default to Arabic
  return 'ar';
}
