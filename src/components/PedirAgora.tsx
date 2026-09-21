export function PedirAgora() {
  return (
    <section id="pedir" className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Pedir agora
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Quer sua Garage 88 sem sair de casa? Faça seu pedido online e
          acompanhe tudo em tempo real.
        </p>
        {/*
          PLACEHOLDER: o link/CTA final depende de como o pedido vai ser
          feito — form próprio integrado ao painel (Supabase) ou
          redirecionamento pra delivery/WhatsApp. Ver briefing.md.
        */}
        <a
          href="#contato"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-background transition hover:bg-accent-2"
        >
          Fazer pedido
        </a>
      </div>
    </section>
  );
}

export function StickyCTA() {
  return (
    <a
      href="#pedir"
      className="fixed inset-x-4 bottom-4 z-50 rounded-full bg-accent px-6 py-3 text-center font-semibold text-background shadow-lg shadow-black/40 transition hover:bg-accent-2 sm:hidden"
    >
      Pedir agora
    </a>
  );
}
