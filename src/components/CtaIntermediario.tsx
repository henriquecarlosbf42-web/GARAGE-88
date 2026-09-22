import Link from "next/link";

export function CtaIntermediario() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Ficou com fome?
        </h2>
        <p className="mt-3 text-muted">
          Seu próximo hambúrguer está a poucos cliques.
        </p>
        <Link
          href="/cardapio"
          className="mt-7 inline-block rounded-full bg-accent px-10 py-4 font-bold uppercase tracking-wide text-background transition hover:bg-accent-2"
        >
          Pedir agora →
        </Link>
      </div>
    </section>
  );
}
