"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NovoPedidoPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("pedidos").insert({
      cliente_nome: form.get("cliente_nome"),
      cliente_telefone: form.get("cliente_telefone"),
      endereco_entrega: form.get("endereco_entrega"),
      itens: form.get("itens"),
      observacoes: form.get("observacoes") || null,
      valor_total: form.get("valor_total") || null,
      taxa_entrega: form.get("taxa_entrega") || null,
      forma_pagamento: form.get("forma_pagamento") || null,
      origem: form.get("origem"),
      pago: form.get("pago") === "on",
      tem_bebida: form.get("tem_bebida") === "on",
    });

    setCarregando(false);

    if (error) {
      setErro("Não deu pra salvar o pedido. Tenta de novo.");
      return;
    }

    router.push("/painel");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-heading text-3xl uppercase tracking-wide">
        Novo pedido
      </h1>
      <p className="mt-1 text-sm text-muted">
        Pra pedidos que chegaram por telefone ou WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Campo label="Nome do cliente" name="cliente_nome" required />
        <Campo label="Telefone / WhatsApp" name="cliente_telefone" />
        <Campo
          label="Endereço de entrega"
          name="endereco_entrega"
          placeholder="Rua, número, bairro, cidade"
        />
        <Campo
          label="Itens do pedido"
          name="itens"
          as="textarea"
          required
          placeholder="1x Maverick, 1x VolksBurger..."
        />
        <Campo label="Observações" name="observacoes" as="textarea" />
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Valor total (R$)"
            name="valor_total"
            type="number"
            step="0.01"
          />
          <Campo
            label="Taxa de entrega (R$)"
            name="taxa_entrega"
            type="number"
            step="0.01"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm text-muted">
            Origem
            <select
              name="origem"
              defaultValue="whatsapp"
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="site">Site</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>
          <label className="text-sm text-muted">
            Forma de pagamento
            <select
              name="forma_pagamento"
              defaultValue=""
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            >
              <option value="">Não definida</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="pix">Pix</option>
            </select>
          </label>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="pago" />
            Já pago
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="tem_bebida" />
            Inclui bebida
          </label>
        </div>

        {erro && <p className="text-sm text-red-400">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Salvar pedido"}
        </button>
      </form>
    </main>
  );
}

function Campo({
  label,
  name,
  as = "input",
  required,
  placeholder,
  type,
  step,
}: {
  label: string;
  name: string;
  as?: "input" | "textarea";
  required?: boolean;
  placeholder?: string;
  type?: string;
  step?: string;
}) {
  const className =
    "mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent";

  return (
    <label className="text-sm text-muted">
      {label}
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          name={name}
          required={required}
          placeholder={placeholder}
          type={type ?? "text"}
          step={step}
          className={className}
        />
      )}
    </label>
  );
}
