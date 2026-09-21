"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Pedido = {
  id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  itens: string;
  observacoes: string | null;
  status: string;
  origem: string;
  valor_total: number | null;
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

export function PedidosTable({ pedidosIniciais }: { pedidosIniciais: Pedido[] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);

  async function atualizarStatus(id: string, status: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );

    const supabase = createClient();
    await supabase.from("pedidos").update({ status }).eq("id", id);
  }

  if (pedidos.length === 0) {
    return (
      <p className="mt-8 text-muted">Nenhum pedido por enquanto.</p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-muted">
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4">Cliente</th>
            <th className="py-3 pr-4">Itens</th>
            <th className="py-3 pr-4">Origem</th>
            <th className="py-3 pr-4">Valor</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="border-b border-white/5">
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
              <td className="py-3 pr-4 capitalize">{pedido.origem}</td>
              <td className="py-3 pr-4">
                {pedido.valor_total
                  ? `R$ ${pedido.valor_total.toFixed(2)}`
                  : "—"}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
