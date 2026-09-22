export function Localizacao() {
  return (
    <section
      id="localizacao"
      className="border-t border-white/10 bg-surface"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-heading text-5xl uppercase tracking-wide sm:text-6xl">
          Localização e horário
        </h2>
        <div className="mx-auto mt-6 grid max-w-3xl gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold uppercase tracking-widest text-accent-2">
              Endereço
            </h3>
            <p className="mt-2 text-lg text-muted">
              Av. Rui Barbosa, 1234 — Santana, São José dos Campos - SP,
              12211-105
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-widest text-accent-2">
              Horário de funcionamento
            </h3>
            <p className="mt-2 text-lg text-muted">
              Quinta a domingo, das 18h30 às 23h30
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
