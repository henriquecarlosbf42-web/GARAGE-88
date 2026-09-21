// PLACEHOLDER — descrição e preço ainda pendentes, nomes já são reais.
const itens = [
  {
    nome: "Maverick",
    descricao: "[Descrição breve dos ingredientes]",
    preco: "R$ 0,00",
  },
  {
    nome: "VolksBurger",
    descricao: "[Descrição breve dos ingredientes]",
    preco: "R$ 0,00",
  },
  {
    nome: "Niandertal",
    descricao: "[Descrição breve dos ingredientes]",
    preco: "R$ 0,00",
  },
  {
    nome: "Fusquinha",
    descricao: "[Descrição breve dos ingredientes]",
    preco: "R$ 0,00",
  },
];

export function Cardapio() {
  return (
    <section id="cardapio" className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
          Cardápio
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Cada hambúrguer da Garage 88 é montado na hora, com ingredientes
          que a gente escolhe a dedo.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => (
            <div
              key={item.nome}
              className="rounded-2xl border border-white/10 bg-background/60 p-6"
            >
              <h3 className="font-heading text-2xl uppercase tracking-wide">
                {item.nome}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.descricao}</p>
              <p className="mt-4 font-semibold text-accent-2">{item.preco}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
