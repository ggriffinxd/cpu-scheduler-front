"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EnFlag } from "../../public/en";
import { EsFlag } from "../../public/es";
import { PtFlag } from "../../public/pt";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    {
      code: "pt",
      name: "Português",
      flag: <PtFlag />,
    },
    {
      code: "es",
      name: "Español",
      flag: <EsFlag />,
    },
    {
      code: "en",
      name: "English",
      flag: <EnFlag />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        key={currentLocale}
        className="flex h-8 w-20 items-center justify-center rounded-md border-2 border-everwhite gap-2 cursor-pointer bg-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        title=""
      >
        {languages.find((language) => language.code === currentLocale)?.flag}
        <p className="text-xs text-everwhite">
          {languages
            .find((language) => language.code === currentLocale)
            ?.code.toUpperCase()}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              router.push(pathname, { locale: language.code });
            }}
            className="cursor-pointer"
          >
            <div
              className="flex items-center justify-center gap-2"
              title={language.name}
            >
              {language.flag}
              <p className="text-sm text-everwhite">{language.name}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
