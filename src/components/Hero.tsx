export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-14 sm:pt-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-2">
          São José dos Campos
        </p>
        <h1 className="font-heading text-5xl uppercase leading-none tracking-wide sm:text-7xl">
          Hambúrguer artesanal, feito de verdade.
        </h1>
        <p className="mt-6 text-lg text-muted">
          Ingredientes selecionados, receita própria, grelha lenta. A Garage
          88 é pra quem não abre mão de qualidade em cada mordida.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#cardapio"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-white/40"
          >
            Ver cardápio
          </a>
          <a
            href="#pedir"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-2"
          >
            Pedir agora
          </a>
        </div>
      </div>
    </section>
  );
}
