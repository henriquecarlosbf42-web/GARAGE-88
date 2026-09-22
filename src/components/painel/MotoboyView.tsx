"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  type Pedido,
  FORMA_PAGAMENTO_LABEL,
  destinoMapa,
  linkRastreio,
  linkWhatsapp,
  linkRotaGoogleMaps,
} from "@/lib/pedidos";
import { QrScanner } from "@/components/painel/QrScanner";

type Aviso = { tipo: "sucesso" | "erro" | "info"; texto: string };

export function MotoboyView({
  pedidosIniciais,
  userId,
}: {
  pedidosIniciais: Pedido[];
  userId: string;
}) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [origin, setOrigin] = useState("");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [scannerAberto, setScannerAberto] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [montandoRota, setMontandoRota] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(t);
  }, [aviso]);

  const filaAtual = pedidos.filter(
    (p) => p.motoboy_id === userId && p.status === "em_preparo",
  );
  const minhasEntregas = pedidos
    .filter(
      (p) =>
        p.motoboy_id === userId &&
        (p.status === "saiu_para_entrega" || p.status === "concluido"),
    )
    .sort((a, b) => (a.status === "concluido" ? 1 : -1));

  const ganhoTotal = minhasEntregas
    .filter((p) => p.status !== "cancelado")
    .reduce((soma, p) => soma + (p.taxa_entrega ?? 0), 0);

  async function handleScan(pedidoId: string) {
    const jaNaFila = pedidos.some((p) => p.id === pedidoId && p.motoboy_id === userId);
    if (jaNaFila) {
      setAviso({ tipo: "info", texto: "Você já pegou esse pedido." });
      return;
    }

    const supabase = createClient();
    const { data: pedido, error: erroBusca } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedidoId)
      .maybeSingle<Pedido>();

    if (erroBusca || !pedido) {
      setAviso({
        tipo: "erro",
        texto: "Pedido não encontrado ou já foi pego por outro motoboy.",
      });
      return;
    }

    const { data: claimado, error: erroClaim } = await supabase
      .from("pedidos")
      .update({ motoboy_id: userId })
      .eq("id", pedidoId)
      .is("motoboy_id", null)
      .select()
      .maybeSingle();

    if (erroClaim || !claimado) {
      setAviso({
        tipo: "erro",
        texto: "Esse pedido já foi pego por outro motoboy nesse instante.",
      });
      return;
    }

    setPedidos((prev) => {
      const existe = prev.some((p) => p.id === pedido.id);
      const atualizado = { ...pedido, motoboy_id: userId };
      return existe
        ? prev.map((p) => (p.id === pedido.id ? atualizado : p))
        : [...prev, atualizado];
    });
    setAviso({ tipo: "sucesso", texto: `Pedido de ${pedido.cliente_nome} adicionado.` });
  }

  async function removerDaFila(id: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, motoboy_id: null } : p)),
    );
    const supabase = createClient();
    await supabase.from("pedidos").update({ motoboy_id: null }).eq("id", id);
  }

  async function montarRota() {
    const ids = filaAtual.map((p) => p.id);
    if (ids.length === 0) return;

    setMontandoRota(true);

    const res = await fetch("/api/rota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const dados = await res.json();

    setMontandoRota(false);

    if (!res.ok) {
      setAviso({ tipo: "erro", texto: dados.erro ?? "Não deu pra montar a rota." });
      return;
    }

    setPedidos((prev) =>
      prev.map((p) =>
        ids.includes(p.id) ? { ...p, status: "saiu_para_entrega" } : p,
      ),
    );

    const supabase = createClient();
    await supabase
      .from("pedidos")
      .update({ status: "saiu_para_entrega" })
      .in("id", ids);

    window.open(dados.url, "_blank");
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
      {aviso && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            aviso.tipo === "sucesso"
              ? "border-accent/40 bg-accent/10"
              : aviso.tipo === "erro"
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-white/10 bg-surface"
          }`}
        >
          {aviso.texto}
        </div>
      )}

      <section>
        <button
          onClick={() => setScannerAberto(true)}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/20 py-10 text-center transition hover:border-accent"
        >
          <span className="text-4xl">📷</span>
          <span className="font-heading text-xl uppercase tracking-wide">
            Escanear pedido
          </span>
          <span className="text-sm text-muted">
            Aponta a câmera pro QR do ticket na cozinha
          </span>
        </button>
      </section>

      {scannerAberto && (
        <QrScanner
          onScan={handleScan}
          onFechar={() => setScannerAberto(false)}
        />
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-wide">
            Minha fila
          </h2>
          {filaAtual.length > 0 && (
            <button
              onClick={montarRota}
              disabled={montandoRota}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
            >
              {montandoRota ? "Calculando melhor rota..." : "Montar rota"}
            </button>
          )}
        </div>

        {filaAtual.length === 0 ? (
          <p className="mt-4 text-muted">
            Nenhum pedido escaneado ainda. Escaneie os tickets que for pegar.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {filaAtual.map((pedido) => (
              <div
                key={pedido.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-surface p-4"
              >
                <div>
                  <div className="font-semibold">{pedido.cliente_nome}</div>
                  <div className="text-sm text-muted">{pedido.itens}</div>
                  <EnderecoLinha pedido={pedido} />
                  {pedido.forma_pagamento && (
                    <div className="text-sm text-muted">
                      Pagamento: {FORMA_PAGAMENTO_LABEL[pedido.forma_pagamento] ?? pedido.forma_pagamento}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-accent-2">
                    {pedido.taxa_entrega ? `R$ ${pedido.taxa_entrega.toFixed(2)}` : "—"}
                  </span>
                  <button
                    onClick={() => removerDaFila(pedido.id)}
                    className="text-xs text-muted underline hover:text-foreground"
                  >
                    Remover
                  </button>
                </div>
              </div>
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
          <p className="mt-4 text-muted">Você ainda não saiu pra nenhuma entrega.</p>
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
                      <EnderecoLinha pedido={pedido} />
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
                    {destinoMapa(pedido) && (
                      <a
                        href={linkRotaGoogleMaps([destinoMapa(pedido)!]) ?? "#"}
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

function EnderecoLinha({ pedido }: { pedido: Pedido }) {
  const temGps = pedido.latitude != null && pedido.longitude != null;
  return (
    <div className="text-sm text-muted">
      {pedido.endereco_entrega || (temGps ? "Localização compartilhada" : "Endereço não informado")}
      {temGps && <span className="ml-1 text-accent-2">📍 GPS</span>}
    </div>
  );
}
