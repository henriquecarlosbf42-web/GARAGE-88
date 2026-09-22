"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
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

    router.push("/painel");
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8"
      >
        <h1 className="font-heading text-3xl uppercase tracking-wide">
          Painel Garage 88
        </h1>
        <p className="mt-1 text-sm text-muted">
          Acesso restrito à equipe.
        </p>

        <label className="mt-6 block text-sm text-muted">
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
        className="mt-6 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Voltar ao site
      </Link>
    </main>
  );
}
