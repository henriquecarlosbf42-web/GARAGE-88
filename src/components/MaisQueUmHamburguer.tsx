import { Wheat, Beef, Milk, Flame, Salad } from "lucide-react";

const DIFERENCIAIS = [
  {
    icone: Wheat,
    titulo: "Pão artesanal",
    descricao: "Assado com cuidado, macio por dentro e crocante por fora.",
  },
  {
    icone: Beef,
    titulo: "Carne premium",
    descricao: "Selecionada, moída na hora, no ponto certo.",
  },
  {
    icone: Milk,
    titulo: "Queijos especiais",
    descricao: "Derretidos na medida, sem economizar.",
  },
  {
    icone: Flame,
    titulo: "Bacon crocante",
    descricao: "Grelhado até o ponto exato de crocância.",
  },
  {
    icone: Salad,
    titulo: "Ingredientes frescos",
    descricao: "Escolhidos a dedo, todos os dias.",
  },
];

export function MaisQueUmHamburguer() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h2 className="font-heading text-5xl uppercase tracking-wide sm:text-6xl">
        Mais que um hambúrguer,
        <br />
        uma <span className="text-accent-2">experiência</span>.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        Cada lanche é preparado com ingredientes selecionados, carne de
        qualidade e aquele cuidado que faz diferença em cada mordida.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {DIFERENCIAIS.map(({ icone: Icone, titulo, descricao }) => (
          <div key={titulo} className="flex flex-col items-center gap-3">
            <Icone className="h-9 w-9 text-accent-2" strokeWidth={1.5} />
            <p className="text-base font-semibold uppercase tracking-wide">
              {titulo}
            </p>
            <p className="text-sm text-muted">{descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
