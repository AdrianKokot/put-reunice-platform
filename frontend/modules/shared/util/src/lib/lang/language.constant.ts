import { TuiCountryIsoCode, TuiLanguageName } from '@taiga-ui/i18n';

export type euniceLocale = string | 'pl' | 'en';

export const LOCALE_FLAGS = new Map<string, TuiCountryIsoCode>([
  ['pl', TuiCountryIsoCode.PL],
  ['en', TuiCountryIsoCode.GB],
]);

const localeToTuiLanguageMap = new Map<euniceLocale, TuiLanguageName>([
  ['pl', 'polish'],
  ['en', 'english'],
]);

export const localeToTuiLanguage = (locale: euniceLocale): TuiLanguageName =>
  localeToTuiLanguageMap.get(locale) ?? 'english';

const languageToLocaleMap = new Map<euniceLocale, string>([
  ['pl', 'pl-PL'],
  ['en', 'en-GB'],
]);

export const langToLocale = (lang: TuiLanguageName): string =>
  languageToLocaleMap.get(lang) ?? 'en-GB';
