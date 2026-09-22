"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  type Pedido,
  linkRastreio,
  linkWhatsapp,
  linkRotaGoogleMaps,
} from "@/lib/pedidos";

export function MotoboyView({
  pedidosIniciais,
  userId,
}: {
  pedidosIniciais: Pedido[];
  userId: string;
}) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [origin, setOrigin] = useState("");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const disponiveis = useMemo(
    () => pedidos.filter((p) => !p.motoboy_id && p.status === "em_preparo"),
    [pedidos],
  );

  const minhasEntregas = useMemo(
    () =>
      pedidos
        .filter((p) => p.motoboy_id === userId)
        .sort((a, b) => (a.status === "concluido" ? 1 : -1)),
    [pedidos, userId],
  );

  const ganhoTotal = minhasEntregas
    .filter((p) => p.status !== "cancelado")
    .reduce((soma, p) => soma + (p.taxa_entrega ?? 0), 0);

  function alternarSelecao(id: string) {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  async function pegarEAbrirRota() {
    const ids = Array.from(selecionados);
    if (ids.length === 0) return;

    const enderecos = pedidos
      .filter((p) => ids.includes(p.id))
      .map((p) => p.endereco_entrega)
      .filter((e): e is string => Boolean(e && e.trim()));

    setPedidos((prev) =>
      prev.map((p) =>
        ids.includes(p.id)
          ? { ...p, motoboy_id: userId, status: "saiu_para_entrega" }
          : p,
      ),
    );
    setSelecionados(new Set());

    const supabase = createClient();
    await supabase
      .from("pedidos")
      .update({ motoboy_id: userId, status: "saiu_para_entrega" })
      .in("id", ids);

    if (enderecos.length > 0) {
      const url = linkRotaGoogleMaps(enderecos);
      if (url) window.open(url, "_blank");
    }
  }

  async function marcarEntregue(id: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "concluido" } : p)),
    );

    const supabase = createClient();
    await supabase.from("pedidos").update({ status: "concluido" }).eq("id", id);
  }

  async function copiarLinkRastreio(pedido: Pedido) {
    const link = linkRastreio(pedido, origin);
    await navigator.clipboard.writeText(link);
    setCopiadoId(pedido.id);
    setTimeout(() => setCopiadoId((atual) => (atual === pedido.id ? null : atual)), 2000);
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-wide">
            Disponíveis pra pegar
          </h2>
          {selecionados.size > 0 && (
            <button
              onClick={pegarEAbrirRota}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2"
            >
              Pegar {selecionados.size} e abrir rota
            </button>
          )}
        </div>

        {disponiveis.length === 0 ? (
          <p className="mt-4 text-muted">Nenhum pedido pronto pra pegar agora.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {disponiveis.map((pedido) => (
              <label
                key={pedido.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-surface p-4"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selecionados.has(pedido.id)}
                  onChange={() => alternarSelecao(pedido.id)}
                />
                <div className="flex-1">
                  <div className="font-semibold">{pedido.cliente_nome}</div>
                  <div className="text-sm text-muted">{pedido.itens}</div>
                  <div className="text-sm text-muted">
                    {pedido.endereco_entrega || "Endereço não informado"}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-accent-2">
                    {pedido.taxa_entrega
                      ? `R$ ${pedido.taxa_entrega.toFixed(2)}`
                      : "—"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-wide">
            Minhas entregas
          </h2>
          <span className="text-sm text-muted">
            Ganho total: <strong className="text-foreground">R$ {ganhoTotal.toFixed(2)}</strong>
          </span>
        </div>

        {minhasEntregas.length === 0 ? (
          <p className="mt-4 text-muted">Você ainda não pegou nenhuma entrega.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {minhasEntregas.map((pedido) => {
              const wa = linkWhatsapp(pedido, origin);
              const concluido = pedido.status === "concluido";
              return (
                <div
                  key={pedido.id}
                  className={`rounded-xl border border-white/10 bg-surface p-4 ${
                    concluido ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{pedido.cliente_nome}</div>
                      <div className="text-sm text-muted">{pedido.itens}</div>
                      <div className="text-sm text-muted">
                        {pedido.endereco_entrega || "Endereço não informado"}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold text-accent-2">
                        {pedido.taxa_entrega
                          ? `R$ ${pedido.taxa_entrega.toFixed(2)}`
                          : "—"}
                      </div>
                      <div className="text-muted">
                        {concluido ? "Entregue" : "Saiu pra entrega"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {!concluido && (
                      <button
                        onClick={() => marcarEntregue(pedido.id)}
                        className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background transition hover:bg-accent-2"
                      >
                        Marcar entregue
                      </button>
                    )}
                    {pedido.endereco_entrega && (
                      <a
                        href={linkRotaGoogleMaps([pedido.endereco_entrega]) ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                      >
                        Abrir no Maps
                      </a>
                    )}
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                      >
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => copiarLinkRastreio(pedido)}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                    >
                      {copiadoId === pedido.id ? "Copiado!" : "Copiar link"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
