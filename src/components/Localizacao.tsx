export function Localizacao() {
  return (
    <section
      id="localizacao"
      className="border-t border-white/10 bg-surface"
    >
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Localização e horário
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-2">
              Endereço
            </h3>
            <p className="mt-2 text-muted">[PLACEHOLDER: endereço completo]</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-2">
              Horário de funcionamento
            </h3>
            <p className="mt-2 text-muted">
              Quinta a domingo, das 18h30 às 23h30
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
