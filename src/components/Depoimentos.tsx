const PLACEHOLDERS = [1, 2, 3];

export function Depoimentos() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          O que nossos clientes dizem
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Em breve, avaliações reais de quem já provou.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLACEHOLDERS.map((n) => (
            <div
              key={n}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-background/40 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-sm text-muted">
                ?
              </div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Avaliação em breve
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
