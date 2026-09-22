"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EquipePage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/painel/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.replace("/painel/motoboy");
        return;
      }
      setAutorizado(true);
    });
  }, [router]);

  if (!autorizado) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-muted">Carregando...</p>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/equipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.get("nome"),
        email: form.get("email"),
        senha: form.get("senha"),
        role: form.get("role"),
      }),
    });

    const data = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setMensagem({ tipo: "erro", texto: data.erro ?? "Não deu pra cadastrar." });
      return;
    }

    setMensagem({ tipo: "ok", texto: "Login criado! Já pode passar pra pessoa." });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-heading text-3xl uppercase tracking-wide">
        Adicionar equipe
      </h1>
      <p className="mt-1 text-sm text-muted">
        Cria o login de um admin ou motoboy novo.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm text-muted">
          Nome
          <input
            name="nome"
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm text-muted">
          Senha (mínimo 6 caracteres)
          <input
            name="senha"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm text-muted">
          Papel
          <select
            name="role"
            defaultValue="motoboy"
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          >
            <option value="motoboy">Motoboy</option>
            <option value="admin">Admin (cozinha/gestão)</option>
          </select>
        </label>

        {mensagem && (
          <p className={mensagem.tipo === "ok" ? "text-sm text-accent-2" : "text-sm text-red-400"}>
            {mensagem.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
        >
          {carregando ? "Criando..." : "Criar login"}
        </button>
      </form>
    </main>
  );
}
