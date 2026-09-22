import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Produto } from "@/lib/produtos";
import { MenuItemCard } from "@/components/ui/menu-item-card";

export async function Destaques() {
  const supabase = await createClient();

  const { data: produtos } = await supabase
    .from("produtos")
    .select("*")
    .eq("disponivel", true)
    .order("ordem")
    .limit(3)
    .returns<Produto[]>();

  const destaques = produtos ?? [];

  return (
    <section id="cardapio" className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Nossos destaques
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Os favoritos da casa.
        </p>

        {destaques.length === 0 ? (
          <p className="mt-10 text-muted">Cardápio em atualização — volte em breve.</p>
        ) : (
          <div className="mt-16 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((produto) => (
              <MenuItemCard
                key={produto.id}
                imageUrl={produto.imagem_url}
                name={produto.nome}
                description={produto.ingredientes || produto.descricao}
                price={produto.preco}
                hrefPedir="/cardapio"
              />
            ))}
          </div>
        )}

        <Link
          href="/cardapio"
          className="mt-10 inline-block rounded-full border border-white/20 px-8 py-3 font-semibold transition hover:border-white/40"
        >
          Ver todo o cardápio →
        </Link>
      </div>
    </section>
  );
}
