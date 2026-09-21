export function Contato() {
  return (
    <section id="contato" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
        Contato
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        Dúvidas, encomendas ou parcerias? Fala com a gente.
      </p>
      <div className="mt-6 flex flex-col gap-2 text-muted">
        <p>
          <span className="text-foreground">WhatsApp:</span> [PLACEHOLDER]
        </p>
        <p>
          <span className="text-foreground">Instagram:</span>{" "}
          <a
            href="https://www.instagram.com/garage88.ne/"
            target="_blank"
            rel="noreferrer"
            className="text-accent-2 hover:underline"
          >
            @garage88.ne
          </a>
        </p>
        <p>
          <span className="text-foreground">Email:</span> [PLACEHOLDER]
        </p>
      </div>
    </section>
  );
}
