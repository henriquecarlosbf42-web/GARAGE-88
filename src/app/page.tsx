import { Header } from "@/components/Header";
import { FotoRecorteParallax } from "@/components/FotoRecorteParallax";
import { Hero } from "@/components/Hero";
import { Cardapio } from "@/components/Cardapio";
import { Sobre } from "@/components/Sobre";
import { Localizacao } from "@/components/Localizacao";
import { FachadaParallax } from "@/components/FachadaParallax";
import { Contato } from "@/components/Contato";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <FotoRecorteParallax
          imagemUrl="/images/equipe-garage88.png"
          alt="Equipe da Garage 88 segurando hambúrgueres artesanais"
          prioridade
        />
        <Hero />
        <FotoRecorteParallax
          imagemUrl="/images/burger-carro-chefe.png"
          alt="Hambúrguer carro-chefe da Garage 88, com queijo derretido e bacon"
        />
        <Cardapio />
        <Sobre />
        <Localizacao />
        <FachadaParallax
          imagemUrl="/images/fachada-garage88.png"
          alt="Fachada da Garage 88 à noite, com fusca estacionado na frente"
        />
        <Contato />
      </main>
      <StickyCTA />
    </>
  );
}
