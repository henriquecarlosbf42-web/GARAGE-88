import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function BotoesFlutuantes() {
  return (
    <>
      {/* Desktop: WhatsApp flutuante no canto inferior direito.
          TODO: trocar href por https://wa.me/<numero> assim que tiver o
          WhatsApp real da Garage 88 -- por ora aponta pro contato no rodapé. */}
      <a
        href="#contato"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-black/40 transition hover:bg-accent-2 sm:flex"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Mobile: barra fixa "Pedir agora" no rodapé da tela. */}
      <Link
        href="/cardapio"
        className="fixed inset-x-4 bottom-4 z-50 rounded-full bg-accent px-6 py-4 text-center text-lg font-semibold text-background shadow-lg shadow-black/40 transition hover:bg-accent-2 sm:hidden"
      >
        🍔 Pedir agora
      </Link>
    </>
  );
}
