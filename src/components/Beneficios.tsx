import { ShieldCheck, Sparkles, Zap, Award } from "lucide-react";

const ITENS = [
  { icone: ShieldCheck, titulo: "Sem taxa", subtitulo: "de entrega" },
  { icone: Sparkles, titulo: "Ingredientes", subtitulo: "selecionados" },
  { icone: Zap, titulo: "Entrega", subtitulo: "rápida" },
  { icone: Award, titulo: "Sabor que", subtitulo: "faz história" },
];

export function Beneficios() {
  return (
    <section className="border-t border-white/10 bg-surface">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 text-center sm:grid-cols-4">
        {ITENS.map(({ icone: Icone, titulo, subtitulo }) => (
          <div key={titulo} className="flex flex-col items-center gap-2">
            <Icone className="h-6 w-6 text-accent-2" strokeWidth={1.5} />
            <p className="text-sm font-semibold uppercase leading-tight tracking-wide">
              {titulo}
              <br />
              {subtitulo}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
