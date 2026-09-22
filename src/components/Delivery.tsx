import Link from "next/link";
import Image from "next/image";

export function Delivery() {
  return (
    <section id="delivery" className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Link
          href="/cardapio"
          className="animate-pulsar-suave block overflow-hidden rounded-2xl shadow-lg shadow-black/40 transition hover:shadow-accent/10"
        >
          <Image
            src="/images/delivery-sem-taxa.png"
            alt="Delivery sem taxa de entrega em São José dos Campos — pedir agora"
            width={1254}
            height={1254}
            className="h-auto w-full"
          />
        </Link>
      </div>
    </section>
  );
}
