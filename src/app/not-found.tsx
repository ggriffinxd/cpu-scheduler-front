import Link from "next/link";
import { type Routing, routing } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
        <p className="mb-4">A página que você está procurando não existe.</p>
        <Link
          href={`/${routing.defaultLocale as Routing}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
