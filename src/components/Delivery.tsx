import { Motorbike } from "lucide-react";

export function Delivery() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="rounded-2xl border border-white/10 bg-background/60 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40">
            <Motorbike className="h-7 w-7 text-accent-2" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-heading text-3xl uppercase tracking-wide sm:text-4xl">
            Delivery sem taxa de entrega
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Peça pelo site e receba direitinho — a Garage 88 não cobra taxa
            de entrega, você paga só o que pediu.
          </p>
          <a
            href="/cardapio"
            className="mt-7 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-background transition hover:bg-accent-2"
          >
            Pedir agora
          </a>
        </div>
      </div>
    </section>
  );
}
