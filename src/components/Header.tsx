import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-heading text-2xl uppercase tracking-wide">
          Garage 88
        </span>
        <nav className="hidden gap-6 text-sm text-muted sm:flex">
          <Link href="#cardapio" className="hover:text-foreground">
            Cardápio
          </Link>
          <Link href="#sobre" className="hover:text-foreground">
            Sobre
          </Link>
          <Link href="#localizacao" className="hover:text-foreground">
            Localização
          </Link>
          <Link href="#contato" className="hover:text-foreground">
            Contato
          </Link>
        </nav>
        <Link
          href="/pedir"
          className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2 sm:inline-block"
        >
          Pedir agora
        </Link>
      </div>
    </header>
  );
}
