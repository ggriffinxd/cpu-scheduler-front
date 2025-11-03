export const locales = ["pt", "es", "en"] as const;

export type Locales = typeof locales;

export const defaultLocale = "pt" as const;
