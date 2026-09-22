import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Produto } from "@/lib/produtos";
import { FeatureCarousel } from "@/components/ui/feature-carousel";

export async function Destaques() {
  const supabase = await createClient();

  const { data: produtos } = await supabase
    .from("produtos")
    .select("*")
    .eq("disponivel", true)
    .order("ordem")
    .limit(8)
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
          <div className="mt-10">
            <FeatureCarousel
              hrefPedir="/cardapio"
              produtos={destaques.map((produto) => ({
                id: produto.id,
                imagem: produto.imagem_url,
                nome: produto.nome,
                ingredientes: produto.ingredientes || produto.descricao,
              }))}
            />
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
