export const i18n = {
  defaultLocale: 'ar',
  locales: ['en', 'ar', 'cs'],
} as const

export type Locale = typeof i18n['locales'][number]
