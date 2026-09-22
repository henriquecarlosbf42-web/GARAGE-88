export function Delivery() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <span className="text-4xl">🛵</span>
        <h2 className="mt-3 font-heading text-3xl uppercase tracking-wide sm:text-4xl">
          Delivery sem taxa de entrega
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Peça pelo site e receba direitinho — a Garage 88 não cobra taxa
          de entrega, você paga só o que pediu.
        </p>
        <a
          href="/cardapio"
          className="mt-6 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-background transition hover:bg-accent-2"
        >
          Pedir agora
        </a>
      </div>
    </section>
  );
}
