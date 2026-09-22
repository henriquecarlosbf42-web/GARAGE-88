export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-14 text-center sm:pt-20">
      <div className="mx-auto max-w-2xl">
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
        <div className="mt-8 flex justify-center">
          <a
            href="/cardapio"
            className="inline-block rounded-full bg-accent px-10 py-4 text-base font-bold uppercase tracking-wide text-background shadow-lg shadow-accent/20 transition hover:bg-accent-2"
          >
            Ver cardápio
          </a>
        </div>
      </div>
    </section>
  );
}
