import { NextIntlClientProvider } from "next-intl";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
