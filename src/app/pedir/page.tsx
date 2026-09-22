"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Categoria, Produto } from "@/lib/produtos";
import {
  type ClienteLocal,
  lerClienteLocal,
  salvarClienteLocal,
} from "@/lib/clienteLocal";

export default function PedirPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteLocal | null>(null);
  const [carregandoCliente, setCarregandoCliente] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<Record<string, number>>({});
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCliente(lerClienteLocal());
    setCarregandoCliente(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categorias")
      .select("*")
      .order("ordem")
      .returns<Categoria[]>()
      .then(({ data }) => setCategorias(data ?? []));

    supabase
      .from("produtos")
      .select("*")
      .eq("disponivel", true)
      .order("ordem")
      .returns<Produto[]>()
      .then(({ data }) => setProdutos(data ?? []));
  }, []);

  function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const novoCliente: ClienteLocal = {
      nome: String(form.get("nome") ?? "").trim(),
      telefone: String(form.get("telefone") ?? "").trim(),
      endereco: String(form.get("endereco") ?? "").trim(),
    };
    if (!novoCliente.nome || !novoCliente.telefone) return;

    salvarClienteLocal(novoCliente);
    setCliente(novoCliente);
  }

  function alterarQuantidade(produtoId: string, delta: number) {
    setCarrinho((prev) => {
      const atual = prev[produtoId] ?? 0;
      const novo = Math.max(0, atual + delta);
      const copia = { ...prev };
      if (novo === 0) delete copia[produtoId];
      else copia[produtoId] = novo;
      return copia;
    });
  }

  const itensCarrinho = Object.entries(carrinho)
    .map(([produtoId, quantidade]) => {
      const produto = produtos.find((p) => p.id === produtoId);
      return produto ? { produto, quantidade } : null;
    })
    .filter((item): item is { produto: Produto; quantidade: number } => item !== null);

  const totalPedido = itensCarrinho.reduce(
    (soma, item) => soma + (item.produto.preco ?? 0) * item.quantidade,
    0,
  );

  async function finalizarPedido() {
    if (!cliente || itensCarrinho.length === 0) return;
    setEnviando(true);
    setErro(null);

    const itensTexto = itensCarrinho
      .map((item) => `${item.quantidade}x ${item.produto.nome}`)
      .join(", ");

    const id = crypto.randomUUID();
    const supabase = createClient();

    const { error } = await supabase.from("pedidos").insert({
      id,
      cliente_nome: cliente.nome,
      cliente_telefone: cliente.telefone,
      endereco_entrega: cliente.endereco || null,
      itens: itensTexto,
      valor_total: totalPedido || null,
      forma_pagamento: formaPagamento,
      origem: "site",
    });

    setEnviando(false);

    if (error) {
      setErro("Não deu pra enviar o pedido. Tenta de novo.");
      return;
    }

    router.push(`/pedido/${id}`);
  }

  if (carregandoCliente) {
    return null;
  }

  if (!cliente) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
          Garage 88
        </p>
        <h1 className="mt-1 font-heading text-3xl uppercase tracking-wide">
          Fazer pedido
        </h1>
        <p className="mt-2 text-muted">
          Só precisamos de nome e WhatsApp pra confirmar seu pedido.
        </p>

        <form onSubmit={handleCadastro} className="mt-8 flex flex-col gap-4">
          <label className="text-sm text-muted">
            Nome
            <input
              name="nome"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm text-muted">
            WhatsApp
            <input
              name="telefone"
              required
              placeholder="(12) 90000-0000"
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm text-muted">
            Endereço de entrega
            <textarea
              name="endereco"
              rows={2}
              placeholder="Rua, número, bairro"
              className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent-2"
          >
            Continuar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
            Garage 88
          </p>
          <h1 className="mt-1 font-heading text-3xl uppercase tracking-wide">
            Monte seu pedido
          </h1>
        </div>
        <button
          onClick={() => setCliente(null)}
          className="text-xs text-muted underline hover:text-foreground"
        >
          Trocar dados
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">Oi, {cliente.nome.split(" ")[0]}!</p>

      {produtos.length === 0 ? (
        <p className="mt-10 text-muted">Cardápio em atualização — volte em breve.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {categorias.map((categoria) => {
            const doGrupo = produtos.filter((p) => p.categoria_id === categoria.id);
            if (doGrupo.length === 0) return null;
            return (
              <div key={categoria.id}>
                <h2 className="font-heading text-xl uppercase tracking-wide text-accent-2">
                  {categoria.nome}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {doGrupo.map((produto) => (
                    <ProdutoLinha
                      key={produto.id}
                      produto={produto}
                      quantidade={carrinho[produto.id] ?? 0}
                      onAlterar={(delta) => alterarQuantidade(produto.id, delta)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {produtos.some((p) => !p.categoria_id) && (
            <div className="flex flex-col gap-3">
              {produtos
                .filter((p) => !p.categoria_id)
                .map((produto) => (
                  <ProdutoLinha
                    key={produto.id}
                    produto={produto}
                    quantidade={carrinho[produto.id] ?? 0}
                    onAlterar={(delta) => alterarQuantidade(produto.id, delta)}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {itensCarrinho.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">
                {itensCarrinho.reduce((n, i) => n + i.quantidade, 0)} item(ns)
              </p>
              <p className="font-heading text-xl uppercase tracking-wide text-accent-2">
                R$ {totalPedido.toFixed(2)}
              </p>
            </div>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="pix">Pix</option>
            </select>
            <button
              onClick={finalizarPedido}
              disabled={enviando}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Finalizar pedido"}
            </button>
          </div>
          {erro && <p className="mx-auto mt-2 max-w-3xl text-sm text-red-400">{erro}</p>}
        </div>
      )}
    </main>
  );
}

function ProdutoLinha({
  produto,
  quantidade,
  onAlterar,
}: {
  produto: Produto;
  quantidade: number;
  onAlterar: (delta: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface p-4">
      {produto.imagem_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={produto.imagem_url}
          alt={produto.nome}
          className="h-16 w-16 rounded-lg object-cover"
        />
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-lg bg-background" />
      )}
      <div className="flex-1">
        <div className="font-semibold">{produto.nome}</div>
        {(produto.ingredientes || produto.descricao) && (
          <div className="text-xs text-muted">
            {produto.ingredientes || produto.descricao}
          </div>
        )}
        {produto.preco != null && (
          <div className="mt-1 text-sm text-accent-2">R$ {produto.preco.toFixed(2)}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onAlterar(-1)}
          disabled={quantidade === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
        >
          −
        </button>
        <span className="w-4 text-center">{quantidade}</span>
        <button
          onClick={() => onAlterar(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}
