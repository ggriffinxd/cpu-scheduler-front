import { Loader2 } from "lucide-react";
import { redirect } from "@/i18n/routing";

export default async function LocaleHome() {
  redirect({ href: "/dashboard", locale: "pt" });

  // biome-ignore lint: reason
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
