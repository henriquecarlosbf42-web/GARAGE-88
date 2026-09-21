import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Cardapio } from "@/components/Cardapio";
import { Sobre } from "@/components/Sobre";
import { Localizacao } from "@/components/Localizacao";
import { Contato } from "@/components/Contato";
import { PedirAgora, StickyCTA } from "@/components/PedirAgora";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <Hero />
        <Cardapio />
        <Sobre />
        <PedirAgora />
        <Localizacao />
        <Contato />
      </main>
      <StickyCTA />
    </>
  );
}
