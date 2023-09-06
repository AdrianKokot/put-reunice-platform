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

const languageToLocaleMap = new Map<ReuniceLocale, string>([
  ['pl', 'pl'],
  ['en', 'en-GB'],
]);

export const langToLocale = (lang: TuiLanguageName): string =>
  languageToLocaleMap.get(lang) ?? 'en-UK';
