"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Categoria, Produto } from "@/lib/produtos";

async function uploadImagem(file: File): Promise<string> {
  const supabase = createClient();
  const extensao = file.name.split(".").pop();
  const caminho = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from("produtos").upload(caminho, file);
  if (error) throw error;

  const { data } = supabase.storage.from("produtos").getPublicUrl(caminho);
  return data.publicUrl;
}

export function ProdutosManager({
  categoriasIniciais,
  produtosIniciais,
}: {
  categoriasIniciais: Categoria[];
  produtosIniciais: Produto[];
}) {
  const [categorias, setCategorias] = useState(categoriasIniciais);
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function adicionarCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!novaCategoria.trim()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("categorias")
      .insert({ nome: novaCategoria.trim(), ordem: categorias.length })
      .select()
      .single<Categoria>();

    if (!error && data) {
      setCategorias((prev) => [...prev, data]);
      setNovaCategoria("");
    }
  }

  async function removerCategoria(id: string) {
    if (!confirm("Remover essa categoria? Os produtos dela ficam sem categoria.")) return;
    const supabase = createClient();
    await supabase.from("categorias").delete().eq("id", id);
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }

  async function salvarProduto(dados: Omit<Produto, "id"> & { id?: string }) {
    const supabase = createClient();

    if (dados.id) {
      const { data, error } = await supabase
        .from("produtos")
        .update(dados)
        .eq("id", dados.id)
        .select()
        .single<Produto>();
      if (!error && data) {
        setProdutos((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("produtos")
        .insert(dados)
        .select()
        .single<Produto>();
      if (!error && data) {
        setProdutos((prev) => [...prev, data]);
      }
    }
    setEditandoId(null);
  }

  async function removerProduto(id: string) {
    if (!confirm("Remover esse produto?")) return;
    const supabase = createClient();
    await supabase.from("produtos").delete().eq("id", id);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  async function alternarDisponivel(produto: Produto) {
    const supabase = createClient();
    const novoValor = !produto.disponivel;
    setProdutos((prev) =>
      prev.map((p) => (p.id === produto.id ? { ...p, disponivel: novoValor } : p)),
    );
    await supabase.from("produtos").update({ disponivel: novoValor }).eq("id", produto.id);
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      <section>
        <h2 className="font-heading text-xl uppercase tracking-wide">Categorias</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3 py-1 text-sm"
            >
              {c.nome}
              <button
                onClick={() => removerCategoria(c.id)}
                className="text-muted hover:text-red-400"
                aria-label={`Remover ${c.nome}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={adicionarCategoria} className="mt-3 flex gap-2">
          <input
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            placeholder="Nova categoria (ex: Hambúrgueres, Bebidas)"
            className="w-full max-w-xs rounded-lg border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-white/40"
          >
            Adicionar
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl uppercase tracking-wide">Produtos</h2>
          {editandoId !== "novo" && (
            <button
              onClick={() => setEditandoId("novo")}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2"
            >
              Novo produto
            </button>
          )}
        </div>

        {editandoId === "novo" && (
          <ProdutoForm
            categorias={categorias}
            onSalvar={salvarProduto}
            onCancelar={() => setEditandoId(null)}
          />
        )}

        <div className="mt-4 flex flex-col gap-3">
          {produtos.map((produto) =>
            editandoId === produto.id ? (
              <ProdutoForm
                key={produto.id}
                categorias={categorias}
                produto={produto}
                onSalvar={salvarProduto}
                onCancelar={() => setEditandoId(null)}
              />
            ) : (
              <div
                key={produto.id}
                className={`flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-surface p-4 ${
                  produto.disponivel ? "" : "opacity-50"
                }`}
              >
                {produto.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-background text-xs text-muted">
                    Sem foto
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold">{produto.nome}</div>
                  <div className="text-sm text-muted">
                    {categorias.find((c) => c.id === produto.categoria_id)?.nome ?? "Sem categoria"}
                  </div>
                  {produto.ingredientes && (
                    <div className="text-xs text-muted">{produto.ingredientes}</div>
                  )}
                </div>
                <div className="font-semibold text-accent-2">
                  {produto.preco ? `R$ ${produto.preco.toFixed(2)}` : "—"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alternarDisponivel(produto)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                  >
                    {produto.disponivel ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    onClick={() => setEditandoId(produto.id)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/40"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removerProduto(produto.id)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-red-400 transition hover:border-red-400"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function ProdutoForm({
  categorias,
  produto,
  onSalvar,
  onCancelar,
}: {
  categorias: Categoria[];
  produto?: Produto;
  onSalvar: (dados: Omit<Produto, "id"> & { id?: string }) => Promise<void>;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [categoriaId, setCategoriaId] = useState(produto?.categoria_id ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [ingredientes, setIngredientes] = useState(produto?.ingredientes ?? "");
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? "");
  const [imagemUrl, setImagemUrl] = useState(produto?.imagem_url ?? "");
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function handleImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnviandoImagem(true);
    try {
      const url = await uploadImagem(file);
      setImagemUrl(url);
    } catch {
      alert("Não deu pra enviar a imagem. Tenta de novo.");
    } finally {
      setEnviandoImagem(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    await onSalvar({
      id: produto?.id,
      nome: nome.trim(),
      categoria_id: categoriaId || null,
      descricao: descricao || null,
      ingredientes: ingredientes || null,
      preco: preco ? Number(preco) : null,
      imagem_url: imagemUrl || null,
      disponivel: produto?.disponivel ?? true,
      ordem: produto?.ordem ?? 0,
    });
    setSalvando(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-surface p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-muted">
          Nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm text-muted">
          Categoria
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          >
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="text-sm text-muted">
        Descrição
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="text-sm text-muted">
        Ingredientes
        <textarea
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
          rows={2}
          placeholder="Pão brioche, blend 180g, queijo cheddar..."
          className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-muted">
          Preço (R$)
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm text-muted">
          Foto
          <input
            type="file"
            accept="image/*"
            onChange={handleImagem}
            className="mt-1 w-full text-xs text-muted"
          />
          {enviandoImagem && <span className="text-xs text-muted">Enviando...</span>}
          {imagemUrl && !enviandoImagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagemUrl} alt="" className="mt-2 h-16 w-16 rounded-lg object-cover" />
          )}
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={salvando || enviandoImagem}
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background transition hover:bg-accent-2 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-full border border-white/20 px-6 py-2 text-sm transition hover:border-white/40"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
