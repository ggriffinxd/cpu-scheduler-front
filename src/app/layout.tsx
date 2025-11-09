import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CPU Scheduler",
  description:
    "Aprenda como funciona o escalonamento de processos em um sistema operacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased  md:overflow-hidden overflow-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
