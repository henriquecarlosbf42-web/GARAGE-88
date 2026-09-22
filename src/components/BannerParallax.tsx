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
    <section className="relative w-full overflow-hidden bg-background">
      <div
        ref={fotoRef}
        className="relative aspect-[16/9] w-full will-change-transform"
      >
        <Image src={imagemUrl} alt={alt} fill className="object-cover" />
      </div>
    </section>
  );
}
