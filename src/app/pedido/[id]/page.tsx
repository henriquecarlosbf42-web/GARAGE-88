"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type StatusPedido = {
  status: string;
  itens: string;
  valor_total: number | null;
  created_at: string;
};

const ETAPAS = [
  { chave: "novo", label: "Pedido recebido" },
  { chave: "em_preparo", label: "Em preparo" },
  { chave: "saiu_para_entrega", label: "Saiu pra entrega" },
  { chave: "concluido", label: "Entregue" },
] as const;

export default function RastreioPedidoPage() {
  const params = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<StatusPedido | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let ativo = true;

    async function buscar() {
      const { data, error } = await supabase
        .rpc("pedido_status", { pedido_id: params.id })
        .maybeSingle<StatusPedido>();

      if (!ativo) return;

      if (error || !data) {
        setNaoEncontrado(true);
        return;
      }
      setPedido(data);
    }

    buscar();
    const intervalo = setInterval(buscar, 10_000);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [params.id]);

  if (naoEncontrado) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <p className="text-muted">
          Pedido não encontrado. Confere se o link está certo.
        </p>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <p className="text-muted">Carregando...</p>
      </main>
    );
  }

  const cancelado = pedido.status === "cancelado";
  const etapaAtual = ETAPAS.findIndex((e) => e.chave === pedido.status);

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
        Garage 88
      </p>
      <h1 className="mt-2 font-heading text-4xl uppercase tracking-wide">
        Seu pedido
      </h1>
      <p className="mt-2 text-muted">{pedido.itens}</p>

      {cancelado ? (
        <p className="mt-10 text-red-400">Esse pedido foi cancelado.</p>
      ) : (
        <ol className="mt-10 flex flex-col gap-6">
          {ETAPAS.map((etapa, i) => {
            const concluida = i <= etapaAtual;
            return (
              <li key={etapa.chave} className="flex items-center gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    concluida
                      ? "border-accent bg-accent text-background"
                      : "border-white/20 text-muted"
                  }`}
                >
                  {concluida ? "✓" : i + 1}
                </span>
                <span className={concluida ? "text-foreground" : "text-muted"}>
                  {etapa.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <a
        href="https://www.instagram.com/garage88.ne/"
        target="_blank"
        rel="noreferrer"
        className="mt-10 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface p-4"
      >
        <span>
          Acompanha a Garage 88 no Instagram <strong>@garage88.ne</strong>
        </span>
        <span className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-background">
          Seguir
        </span>
      </a>

      <p className="mt-6 text-xs text-muted">
        Essa página atualiza sozinha a cada 10 segundos.
      </p>
    </main>
  );
}
