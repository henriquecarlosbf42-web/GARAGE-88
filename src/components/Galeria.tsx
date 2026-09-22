import Image from "next/image";

const PENDENTES = ["Chapa", "Batata", "Bastidores", "Bebidas"];

export function Galeria() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h2 className="font-heading text-4xl uppercase tracking-wide sm:text-5xl">
        Galeria
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">
        Um pouco do nosso ambiente e dos bastidores.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
          <Image
            src="/images/fachada-garage88.png"
            alt="Fachada da Garage 88 à noite"
            fill
            className="object-cover transition duration-500 hover:scale-105"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
          <Image
            src="/images/equipe-garage88.png"
            alt="Equipe da Garage 88"
            fill
            className="object-contain p-4 transition duration-500 hover:scale-105"
          />
        </div>
        {PENDENTES.map((nome) => (
          <div
            key={nome}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/15 bg-surface/40 text-xs uppercase tracking-widest text-muted"
          >
            Foto de {nome} em breve
          </div>
        ))}
      </div>
    </section>
  );
}
