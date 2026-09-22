"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  type Pedido,
  FORMA_PAGAMENTO_LABEL,
  destinoMapa,
  horaPedido,
  linkRastreio,
  linkWhatsapp,
  linkRotaGoogleMaps,
} from "@/lib/pedidos";
import { QrScanner } from "@/components/painel/QrScanner";

type Aviso = { tipo: "sucesso" | "erro" | "info"; texto: string };

type EstadoScanner =
  | { tipo: "fechado" }
  | { tipo: "escaneando_pegar" }
  | { tipo: "confirmado_pegar"; pedido: Pedido }
  | { tipo: "escaneando_entrega"; alvo: Pedido };

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
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [montandoRota, setMontandoRota] = useState(false);
  const [scanner, setScanner] = useState<EstadoScanner>({ tipo: "fechado" });

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

  async function handleScanPegar(pedidoId: string) {
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
        texto:
          "Não consegui pegar esse pedido. Ou ele ainda não está \"Em preparo\" no painel, ou já foi pego por outro motoboy, ou o QR não é de um pedido válido.",
      });
      return;
    }

    const { data: claimado, error: erroClaim } = await supabase
      .from("pedidos")
      .update({ motoboy_id: userId })
      .eq("id", pedidoId)
      .is("motoboy_id", null)
      .select()
      .maybeSingle<Pedido>();

    if (erroClaim || !claimado) {
      setAviso({
        tipo: "erro",
        texto: "Esse pedido já foi pego por outro motoboy nesse instante.",
      });
      return;
    }

    setPedidos((prev) => {
      const existe = prev.some((p) => p.id === claimado.id);
      return existe
        ? prev.map((p) => (p.id === claimado.id ? claimado : p))
        : [...prev, claimado];
    });
    setScanner({ tipo: "confirmado_pegar", pedido: claimado });
  }

  async function handleScanEntrega(pedidoId: string, alvo: Pedido) {
    if (pedidoId !== alvo.id) {
      setScanner({ tipo: "fechado" });
      setAviso({
        tipo: "erro",
        texto: `Esse QR não é do pedido de ${alvo.cliente_nome}. Confere se é o endereço certo antes de entregar!`,
      });
      return;
    }

    setPedidos((prev) =>
      prev.map((p) => (p.id === alvo.id ? { ...p, status: "concluido" } : p)),
    );
    const supabase = createClient();
    await supabase.from("pedidos").update({ status: "concluido" }).eq("id", alvo.id);

    setScanner({ tipo: "fechado" });
    setAviso({ tipo: "sucesso", texto: `Pedido de ${alvo.cliente_nome} entregue!` });
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
          onClick={() => setScanner({ tipo: "escaneando_pegar" })}
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

      {scanner.tipo === "escaneando_pegar" && (
        <QrScanner
          onScan={handleScanPegar}
          onFechar={() => setScanner({ tipo: "fechado" })}
        />
      )}

      {scanner.tipo === "escaneando_entrega" && (
        <QrScanner
          onScan={(texto) => handleScanEntrega(texto, scanner.alvo)}
          onFechar={() => setScanner({ tipo: "fechado" })}
        />
      )}

      {scanner.tipo === "confirmado_pegar" && (
        <ConfirmacaoScan
          pedido={scanner.pedido}
          onEscanearOutro={() => setScanner({ tipo: "escaneando_pegar" })}
          onFechar={() => setScanner({ tipo: "fechado" })}
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
                  <div className="text-xs text-muted">{horaPedido(pedido)}</div>
                  <div className="font-semibold">{pedido.cliente_nome}</div>
                  <div className="text-sm text-muted">
                    {pedido.itens}
                    {pedido.tem_bebida && (
                      <span className="ml-1 font-semibold text-accent-2">
                        🥤 não esqueça a bebida!
                      </span>
                    )}
                  </div>
                  <EnderecoLinha pedido={pedido} />
                  <div className="text-sm text-muted">
                    {pedido.forma_pagamento
                      ? FORMA_PAGAMENTO_LABEL[pedido.forma_pagamento] ?? pedido.forma_pagamento
                      : "Pagamento não definido"}
                    {" · "}
                    <span className={pedido.pago ? "text-accent-2" : "text-red-300"}>
                      {pedido.pago ? "pago" : "cobrar na entrega"}
                    </span>
                  </div>
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
                      <div className="text-xs text-muted">{horaPedido(pedido)}</div>
                      <div className="font-semibold">{pedido.cliente_nome}</div>
                      <div className="text-sm text-muted">
                        {pedido.itens}
                        {pedido.tem_bebida && <span className="ml-1">🥤</span>}
                      </div>
                      <EnderecoLinha pedido={pedido} />
                      <div className="text-sm text-muted">
                        {pedido.forma_pagamento
                          ? FORMA_PAGAMENTO_LABEL[pedido.forma_pagamento] ?? pedido.forma_pagamento
                          : "Pagamento não definido"}
                        {" · "}
                        <span className={pedido.pago ? "text-accent-2" : "text-red-300"}>
                          {pedido.pago ? "pago" : "cobrar na entrega"}
                        </span>
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
                        onClick={() => setScanner({ tipo: "escaneando_entrega", alvo: pedido })}
                        className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background transition hover:bg-accent-2"
                      >
                        Entregar pedido (escanear)
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

function ConfirmacaoScan({
  pedido,
  onEscanearOutro,
  onFechar,
}: {
  pedido: Pedido;
  onEscanearOutro: () => void;
  onFechar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl text-background">
        ✓
      </span>
      <h2 className="mt-4 font-heading text-2xl uppercase tracking-wide">
        Pedido escaneado!
      </h2>
      <p className="mt-2 font-semibold">{pedido.cliente_nome}</p>
      <p className="text-sm text-muted">{pedido.itens}</p>
      {pedido.tem_bebida && (
        <p className="mt-2 font-semibold text-accent-2">🥤 Não esqueça a bebida!</p>
      )}

      <button
        onClick={onEscanearOutro}
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-2"
      >
        Escanear outro pedido
      </button>
      <button
        onClick={onFechar}
        className="mt-3 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:border-white/40"
      >
        Terminar por aqui
      </button>
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
