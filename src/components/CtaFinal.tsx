import Link from "next/link";

export function CtaFinal() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="font-heading text-5xl uppercase tracking-wide sm:text-7xl">
          Agora é só escolher.
        </h2>
        <p className="mt-4 text-xl text-muted">
          Seu hambúrguer está esperando por você.
        </p>
        <Link
          href="/cardapio"
          className="mt-8 inline-block rounded-full bg-accent px-14 py-6 text-xl font-bold uppercase tracking-wide text-background shadow-lg shadow-white/10 transition hover:bg-accent-2"
        >
          Pedir agora →
        </Link>
      </div>
    </section>
  );
}
