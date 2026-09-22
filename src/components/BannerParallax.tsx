"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Deslocamento maximo do efeito -- pequeno de propósito, pra imagem
// assentar rápido (só enquanto ela está entrando na tela, não a rolagem
// da página inteira) e o lanche ficar em evidência logo.
const DESLOCAMENTO_MAX = 32;

export function BannerParallax({
  imagemUrl,
  alt,
}: {
  imagemUrl: string;
  alt: string;
}) {
  const fotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    function aplicarParallax() {
      const el = fotoRef.current;
      const secao = el?.closest("section");
      if (el && secao) {
        const rect = secao.getBoundingClientRect();
        const alturaTela = window.innerHeight;
        // progresso: 0 quando a seção está entrando pela base da tela,
        // 1 quando o topo dela já chegou no topo da tela.
        const progresso = Math.max(0, Math.min(1, (alturaTela - rect.top) / alturaTela));
        const deslocamento = (1 - progresso) * DESLOCAMENTO_MAX;
        el.style.transform = `translateY(${deslocamento}px)`;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(aplicarParallax);
        ticking = true;
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="w-full overflow-hidden bg-background py-10">
      <div ref={fotoRef} className="will-change-transform">
        <Image
          src={imagemUrl}
          alt={alt}
          width={1677}
          height={938}
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
