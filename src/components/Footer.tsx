import Link from "next/link";
import { AtSign } from "lucide-react";

export function Footer() {
  return (
    <footer id="contato" className="border-t border-white/10 bg-background">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 text-center sm:grid-cols-4 sm:text-left">
        <div>
          <span className="font-heading text-3xl uppercase tracking-wide">
            Garage 88
          </span>
          <p className="mt-2 text-base text-muted">
            Hambúrguer artesanal em São José dos Campos.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-2">
            Navegação
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-base text-muted">
            <li>
              <Link href="/" className="hover:text-foreground">
                Início
              </Link>
            </li>
            <li>
              <Link href="/cardapio" className="hover:text-foreground">
                Cardápio
              </Link>
            </li>
            <li>
              <a href="#delivery" className="hover:text-foreground">
                Delivery
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-foreground">
                Sobre
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-2">
            Contato
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-base text-muted">
            <li>WhatsApp: [PLACEHOLDER]</li>
            <li>
              <a
                href="https://www.instagram.com/garage88.ne/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <AtSign className="h-4 w-4" />
                @garage88.ne
              </a>
            </li>
            <li>Email: [PLACEHOLDER]</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-2">
            Horário e localização
          </h3>
          <p className="mt-3 text-base text-muted">
            Quinta a domingo, das 18h30 às 23h30
          </p>
          <p className="mt-2 text-base text-muted">
            Av. Rui Barbosa, 1234 — Santana
            <br />
            São José dos Campos - SP, 12211-105
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} Garage 88. Todos os direitos reservados.</p>
        <Link
          href="/painel"
          className="mt-2 inline-block underline-offset-4 hover:text-foreground hover:underline"
        >
          Acessar Painel
        </Link>
      </div>
    </footer>
  );
}
