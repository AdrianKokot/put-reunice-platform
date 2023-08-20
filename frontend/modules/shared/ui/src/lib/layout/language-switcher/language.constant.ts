import { TuiCountryIsoCode, TuiLanguageName } from '@taiga-ui/i18n';

export type ReuniceLocale = string | 'pl' | 'en';

export const LOCALE_FLAGS = new Map<string, TuiCountryIsoCode>([
  ['pl', TuiCountryIsoCode.PL],
  ['en', TuiCountryIsoCode.GB],
]);

const localeToTuiLanguageMap = new Map<ReuniceLocale, TuiLanguageName>([
  ['pl', 'polish'],
  ['en', 'english'],
]);

export const localeToTuiLanguage = (locale: ReuniceLocale): TuiLanguageName =>
  localeToTuiLanguageMap.get(locale) ?? 'english';
