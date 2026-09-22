"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Pedido = {
  id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  endereco_entrega: string | null;
  itens: string;
  observacoes: string | null;
  status: string;
  origem: string;
  valor_total: number | null;
  taxa_entrega: number | null;
  created_at: string;
};

const STATUS_OPCOES = [
  "novo",
  "em_preparo",
  "saiu_para_entrega",
  "concluido",
  "cancelado",
] as const;

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_preparo: "Em preparo",
  saiu_para_entrega: "Saiu pra entrega",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function normalizarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.startsWith("55")) return digitos;
  return `55${digitos}`;
}

function linkRastreio(pedido: Pedido, origin: string) {
  return `${origin}/pedido/${pedido.id}`;
}

function linkWhatsapp(pedido: Pedido, origin: string) {
  if (!pedido.cliente_telefone) return null;
  const numero = normalizarTelefone(pedido.cliente_telefone);
  const primeiroNome = pedido.cliente_nome.split(" ")[0];
  const link = linkRastreio(pedido, origin);

  const mensagem =
    pedido.status === "saiu_para_entrega"
      ? `Oi ${primeiroNome}! Seu pedido da Garage 88 saiu pra entrega 🛵 Prepare-se pra receber! Acompanhe aqui: ${link}`
      : `Oi ${primeiroNome}! Recebemos seu pedido na Garage 88 🍔 Acompanhe o andamento aqui: ${link}`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

function linkRotaGoogleMaps(enderecos: string[]) {
  if (enderecos.length === 0) return null;
  const destino = encodeURIComponent(enderecos[enderecos.length - 1]);
  const paradas = enderecos
    .slice(0, -1)
    .map((e) => encodeURIComponent(e))
    .join("|");
  const params = new URLSearchParams({
    api: "1",
    destination: destino,
    travelmode: "driving",
  });
  let url = `https://www.google.com/maps/dir/?${params.toString()}`;
  if (paradas) url += `&waypoints=${paradas}`;
  return url;
}

export function PedidosTable({ pedidosIniciais }: { pedidosIniciais: Pedido[] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copiarLinkRastreio(pedido: Pedido) {
    const link = linkRastreio(pedido, origin);
    await navigator.clipboard.writeText(link);
    setCopiadoId(pedido.id);
    setTimeout(() => setCopiadoId((atual) => (atual === pedido.id ? null : atual)), 2000);
  }

  const pedidosSelecionados = useMemo(
    () => pedidos.filter((p) => selecionados.has(p.id)),
    [pedidos, selecionados],
  );

  const totalTaxaSelecionada = pedidosSelecionados.reduce(
    (soma, p) => soma + (p.taxa_entrega ?? 0),
    0,
  );

  function alternarSelecao(id: string) {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  async function atualizarStatus(id: string, status: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );

    const supabase = createClient();
    await supabase.from("pedidos").update({ status }).eq("id", id);
  }

  async function biparSelecionados() {
    const ids = Array.from(selecionados);
    if (ids.length === 0) return;

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
  }

  function abrirRota() {
    const enderecos = pedidosSelecionados
      .map((p) => p.endereco_entrega)
      .filter((e): e is string => Boolean(e && e.trim()));

    if (enderecos.length === 0) {
      alert("Nenhum pedido selecionado tem endereço de entrega cadastrado.");
      return;
    }

    const url = linkRotaGoogleMaps(enderecos);
    if (url) window.open(url, "_blank");
  }

  if (pedidos.length === 0) {
    return <p className="mt-8 text-muted">Nenhum pedido por enquanto.</p>;
  }

  return (
    <div className="mt-8">
      {selecionados.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-surface p-4">
          <span className="text-sm">
            {selecionados.size} selecionado(s) · você ganha{" "}
            <strong>R$ {totalTaxaSelecionada.toFixed(2)}</strong> nessa rota
          </span>
          <button
            onClick={abrirRota}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2"
          >
            Abrir rota no Google Maps
          </button>
          <button
            onClick={biparSelecionados}
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-white/40"
          >
            Bipar (marcar saiu pra entrega)
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="text-muted">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4"></th>
              <th className="py-3 pr-4">Cliente</th>
              <th className="py-3 pr-4">Itens</th>
              <th className="py-3 pr-4">Endereço</th>
              <th className="py-3 pr-4">Valor</th>
              <th className="py-3 pr-4">Taxa</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Avisar</th>
              <th className="py-3 pr-4">Rastreio</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const wa = linkWhatsapp(pedido, origin);
              return (
                <tr key={pedido.id} className="border-b border-white/5 align-top">
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      checked={selecionados.has(pedido.id)}
                      onChange={() => alternarSelecao(pedido.id)}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <div>{pedido.cliente_nome}</div>
                    {pedido.cliente_telefone && (
                      <div className="text-xs text-muted">
                        {pedido.cliente_telefone}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 max-w-xs">
                    <div>{pedido.itens}</div>
                    {pedido.observacoes && (
                      <div className="text-xs text-muted">
                        {pedido.observacoes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 max-w-[200px] text-xs text-muted">
                    {pedido.endereco_entrega || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    {pedido.valor_total ? `R$ ${pedido.valor_total.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    {pedido.taxa_entrega ? `R$ ${pedido.taxa_entrega.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={pedido.status}
                      onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-background px-2 py-1 text-sm outline-none focus:border-accent"
                    >
                      {STATUS_OPCOES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => copiarLinkRastreio(pedido)}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                    >
                      {copiadoId === pedido.id ? "Copiado!" : "Copiar link"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
