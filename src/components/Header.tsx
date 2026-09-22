"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function Header() {
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    function onScroll() {
      setRolado(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-md transition-all ${
        rolado ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-3xl uppercase tracking-wide">
          Garage 88
        </Link>
        <nav className="hidden gap-6 text-base text-muted sm:flex">
          <Link href="/" className="hover:text-foreground">
            Início
          </Link>
          <Link href="/cardapio" className="hover:text-foreground">
            Cardápio
          </Link>
          <Link href="#sobre" className="hover:text-foreground">
            Sobre
          </Link>
          <Link href="#delivery" className="hover:text-foreground">
            Delivery
          </Link>
          <Link href="#contato" className="hover:text-foreground">
            Contato
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contato"
            aria-label="WhatsApp"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 text-muted transition hover:border-white/40 hover:text-foreground sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Link
            href="/cardapio"
            className="rounded-full bg-accent px-5 py-2.5 text-base font-semibold text-background transition hover:bg-accent-2"
          >
            Pedir agora
          </Link>
        </div>
      </div>
    </header>
  );
}
