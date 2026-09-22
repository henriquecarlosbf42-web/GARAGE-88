import { Header } from "@/components/Header";
import { FotoRecorteParallax } from "@/components/FotoRecorteParallax";
import { Hero } from "@/components/Hero";
import { Beneficios } from "@/components/Beneficios";
import { MaisQueUmHamburguer } from "@/components/MaisQueUmHamburguer";
import { BannerParallax } from "@/components/BannerParallax";
import { Destaques } from "@/components/Destaques";
import { CtaIntermediario } from "@/components/CtaIntermediario";
import { Delivery } from "@/components/Delivery";
import { Depoimentos } from "@/components/Depoimentos";
import { Galeria } from "@/components/Galeria";
import { SigaAGente } from "@/components/SigaAGente";
import { Sobre } from "@/components/Sobre";
import { Eventos } from "@/components/Eventos";
import { Localizacao } from "@/components/Localizacao";
import { FachadaParallax } from "@/components/FachadaParallax";
import { CtaFinal } from "@/components/CtaFinal";
import { Footer } from "@/components/Footer";
import { BotoesFlutuantes } from "@/components/BotoesFlutuantes";

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
        <Beneficios />
        <MaisQueUmHamburguer />
        <BannerParallax
          imagemUrl="/images/burger-carro-chefe.png"
          alt="Maverick, o hambúrguer carro-chefe da Garage 88"
        />
        <Destaques />
        <CtaIntermediario />
        <Delivery />
        <Depoimentos />
        <Galeria />
        <SigaAGente />
        <Sobre />
        <Eventos />
        <Localizacao />
        <FachadaParallax
          imagemUrl="/images/fachada-garage88.png"
          alt="Fachada da Garage 88 à noite, com fusca estacionado na frente"
        />
        <CtaFinal />
      </main>
      <Footer />
      <BotoesFlutuantes />
    </>
  );
}
