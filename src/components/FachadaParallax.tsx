"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function FachadaParallax({
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
      if (fotoRef.current) {
        const secao = fotoRef.current.closest("section");
        const topo = secao?.getBoundingClientRect().top ?? 0;
        const deslocamento = topo * -0.2;
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
    <section className="relative h-[70vh] w-full overflow-hidden bg-surface sm:h-[85vh]">
      <div
        ref={fotoRef}
        className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
      >
        <Image src={imagemUrl} alt={alt} fill priority={false} className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
          Venha nos visitar
        </p>
        <h2 className="mt-2 font-heading text-3xl uppercase tracking-wide text-foreground sm:text-4xl">
          Garage 88
        </h2>
      </div>
    </section>
  );
}
