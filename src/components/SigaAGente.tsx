import { AtSign } from "lucide-react";

export function SigaAGente() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-14 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Siga a gente
        </h2>
        <p className="mt-3 text-lg text-muted">
          Bastidores, novidades e o cardápio em primeira mão.
        </p>
        <a
          href="https://www.instagram.com/garage88.ne/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold transition hover:border-white/40"
        >
          <AtSign className="h-5 w-5" />
          @garage88.ne
        </a>
      </div>
    </section>
  );
}
