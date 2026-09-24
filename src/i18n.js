import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/locales/en.json';
import de from './i18n/locales/de.json';
import tr from './i18n/locales/tr.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
  tr: { translation: tr }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
