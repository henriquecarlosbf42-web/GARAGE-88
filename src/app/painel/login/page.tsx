"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Papel = "atendente" | "entregador";

export default function LoginPage() {
  const router = useRouter();
  const [papel, setPapel] = useState<Papel>("atendente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    // O papel real (admin/motoboy) vem do cadastro da conta, não do que foi
    // selecionado aqui -- essa escolha é só pra pré-selecionar a tela certa.
    // Se a conta for de outro papel, o painel já redireciona sozinho.
    router.push(papel === "entregador" ? "/painel/motoboy" : "/painel");
    router.refresh();
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <Image
        src="/images/login-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/90" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-background/70 p-8 backdrop-blur-md">
        <h1 className="font-heading text-3xl uppercase tracking-wide">
          Painel Garage 88
        </h1>
        <p className="mt-1 text-sm text-muted">Acesso restrito à equipe.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPapel("atendente")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              papel === "atendente"
                ? "border-accent bg-accent text-background"
                : "border-white/15 text-muted hover:border-white/30",
            )}
          >
            Atendente
          </button>
          <button
            type="button"
            onClick={() => setPapel("entregador")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              papel === "entregador"
                ? "border-accent bg-accent text-background"
                : "border-white/15 text-muted hover:border-white/30",
            )}
          >
            Entregador
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-sm text-muted">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </label>

          <label className="mt-4 block text-sm text-muted">
            Senha
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </label>

          {erro && <p className="mt-4 text-sm text-red-400">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-6 w-full rounded-full bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}
