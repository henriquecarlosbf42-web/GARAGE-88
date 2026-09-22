import { Header } from "@/components/Header";
import { FotoTopo } from "@/components/FotoTopo";
import { Hero } from "@/components/Hero";
import { Cardapio } from "@/components/Cardapio";
import { Sobre } from "@/components/Sobre";
import { Localizacao } from "@/components/Localizacao";
import { Contato } from "@/components/Contato";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <FotoTopo
          imagemUrl="/images/equipe-garage88.png"
          alt="Equipe da Garage 88 segurando hambúrgueres artesanais"
        />
        <Hero />
        <Cardapio />
        <Sobre />
        <Localizacao />
        <Contato />
      </main>
      <StickyCTA />
    </>
  );
}
