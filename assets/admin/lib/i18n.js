import { createI18n } from 'vue-i18n'

import frTranslations from '../../../translations/messages.fr.json'
import enTranslations from '../../../translations/messages.en.json'

const i18n = createI18n({
  locale: import.meta.env.VITE_LOCALE || 'en',
  fallbackLocale: 'en',
  messages: {
    fr: frTranslations,
    en: enTranslations
  }
})

export default i18n
