import { createI18n } from 'vue-i18n';
import config from '@/config/gameConfig';
import eng from '@/locales/eng.json';
import fr from '@/locales/fr.json';

const messages = {
  eng,
  fr,
};

const savedLocale = localStorage.getItem(config.localStorage.sufix + config.localStorage.localLanguage) || config.otherParameters.defaultLanguage;
const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: config.otherParameters.defaultLanguage,
  messages
});

export default i18n;