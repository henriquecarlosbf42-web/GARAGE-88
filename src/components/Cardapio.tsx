import { createClient } from "@/lib/supabase/server";
import type { Categoria, Produto } from "@/lib/produtos";

export async function Cardapio() {
  const supabase = await createClient();

  const [{ data: categorias }, { data: produtos }] = await Promise.all([
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
    supabase
      .from("produtos")
      .select("*")
      .eq("disponivel", true)
      .order("ordem")
      .returns<Produto[]>(),
  ]);

  const temProdutos = (produtos?.length ?? 0) > 0;

  const grupos = (categorias ?? []).map((categoria) => ({
    categoria,
    produtos: (produtos ?? []).filter((p) => p.categoria_id === categoria.id),
  }));

  const semCategoria = (produtos ?? []).filter((p) => !p.categoria_id);

  return (
    <section id="cardapio" className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Cardápio
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Cada hambúrguer da Garage 88 é montado na hora, com ingredientes
          que a gente escolhe a dedo.
        </p>

        {!temProdutos && (
          <p className="mt-10 text-muted">Cardápio em atualização — volte em breve.</p>
        )}

        <div className="mt-10 flex flex-col gap-12">
          {grupos
            .filter((g) => g.produtos.length > 0)
            .map(({ categoria, produtos }) => (
              <div key={categoria.id}>
                <h3 className="font-heading text-2xl uppercase tracking-wide text-accent-2">
                  {categoria.nome}
                </h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {produtos.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} />
                  ))}
                </div>
              </div>
            ))}

          {semCategoria.length > 0 && (
            <div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {semCategoria.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/60">
      {produto.imagem_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={produto.imagem_url}
          alt={produto.nome}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-6">
        <h4 className="font-heading text-2xl uppercase tracking-wide">
          {produto.nome}
        </h4>
        {(produto.ingredientes || produto.descricao) && (
          <p className="mt-2 text-sm text-muted">
            {produto.ingredientes || produto.descricao}
          </p>
        )}
        {produto.preco != null && (
          <p className="mt-4 font-semibold text-accent-2">
            R$ {produto.preco.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
