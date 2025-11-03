import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales, type Locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locales[number])) {
    notFound();
  }

  const validLocale = locale as Locales[number];

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
    timeZone: "America/Sao_Paulo",
  };
});
