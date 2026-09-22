import Link from "next/link";

export function Rodape() {
  return (
    <footer className="border-t border-white/10 py-8 text-center">
      <Link
        href="/painel"
        className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        Acessar Painel
      </Link>
    </footer>
  );
}
