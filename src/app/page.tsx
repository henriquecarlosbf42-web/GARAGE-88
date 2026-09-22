import { Header } from "@/components/Header";
import { FotoRecorteParallax } from "@/components/FotoRecorteParallax";
import { Hero } from "@/components/Hero";
import { Cardapio } from "@/components/Cardapio";
import { Sobre } from "@/components/Sobre";
import { Eventos } from "@/components/Eventos";
import { Localizacao } from "@/components/Localizacao";
import { FachadaParallax } from "@/components/FachadaParallax";
import { BannerParallax } from "@/components/BannerParallax";
import { Contato } from "@/components/Contato";
import { Rodape } from "@/components/Rodape";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <FotoRecorteParallax
          imagemUrl="/images/equipe-garage88.png"
          alt="Equipe da Garage 88 segurando hambúrgueres artesanais"
          prioridade
        />
        <Hero />
        <BannerParallax
          imagemUrl="/images/burger-carro-chefe.png"
          alt="Maverick, o hambúrguer carro-chefe da Garage 88"
        />
        <Cardapio />
        <Sobre />
        <Eventos />
        <Localizacao />
        <FachadaParallax
          imagemUrl="/images/fachada-garage88.png"
          alt="Fachada da Garage 88 à noite, com fusca estacionado na frente"
        />
        <Contato />
      </main>
      <Rodape />
    </>
  );
}
