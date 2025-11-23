import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { GithubIcon } from "lucide-react";

export async function Footer() {
  const t = await getTranslations("dashboard.footer");
  return (
    <div className="bg-background-primary h-36 flex flex-col items-center justify-center">
      <GithubIcon className="w-6 h-6 text-everwhite" />
      <span className="text-everwhite">{t("developedBy")}</span>
      <span className="text-everwhite flex items-center gap-1">
        <Link
          href="https://github.com/KarMiguel"
          target="_blank"
          className="hover:underline text-everwhite"
        >
          {t("carlosMiguel")}
        </Link>{" "}
        <Link
          href="https://github.com/Sander-dev"
          target="_blank"
          className="hover:underline text-everwhite"
        >
          {t("felipeSander")}
        </Link>{" "}
        {t("and")}{" "}
        <Link
          href="https://github.com/ggriffinxd"
          target="_blank"
          className="hover:underline text-everwhite"
        >
          {t("gabrielAlmeida")}
        </Link>
      </span>
    </div>
  );
}
