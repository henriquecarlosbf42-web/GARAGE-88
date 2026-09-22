"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
      if (fotoRef.current) {
        const secao = fotoRef.current.closest("section");
        const topo = secao?.getBoundingClientRect().top ?? 0;
        fotoRef.current.style.transform = `translateY(${topo * -0.15}px)`;
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
      <div className="relative mx-auto aspect-[1677/938] w-full">
        <div ref={fotoRef} className="absolute inset-0 will-change-transform">
          <Image
            src={imagemUrl}
            alt={alt}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
    </section>
  );
}
