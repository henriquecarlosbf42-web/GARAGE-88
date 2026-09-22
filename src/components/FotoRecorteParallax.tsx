"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function FotoRecorteParallax({
  imagemUrl,
  alt,
  prioridade = false,
}: {
  imagemUrl: string;
  alt: string;
  prioridade?: boolean;
}) {
  const fotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    function aplicarParallax() {
      if (fotoRef.current) {
        const secao = fotoRef.current.closest("section");
        const topo = secao?.getBoundingClientRect().top ?? 0;
        const deslocamento = topo * -0.15;
        fotoRef.current.style.transform = `translateY(${deslocamento}px)`;
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-surface">
      <div className="relative mx-auto aspect-square w-full max-w-3xl sm:max-w-4xl">
        <div ref={fotoRef} className="absolute inset-0 will-change-transform">
          <Image
            src={imagemUrl}
            alt={alt}
            fill
            priority={prioridade}
            className="object-contain"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
    </section>
  );
}
