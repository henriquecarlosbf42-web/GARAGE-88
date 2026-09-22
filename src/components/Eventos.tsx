export function Eventos() {
  return (
    <section id="eventos" className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Aniversário e confraternização
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          A Garage 88 também recebe o seu evento — aniversário,
          confraternização de trabalho ou qualquer ocasião especial. Fala
          com a gente e reserva o espaço.
        </p>
        <a
          href="#contato"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-background transition hover:bg-accent-2"
        >
          Reservar espaço
        </a>
      </div>
    </section>
  );
}
