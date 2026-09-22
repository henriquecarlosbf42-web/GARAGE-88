"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function FotoTopo({
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
        const deslocamento = window.scrollY * 0.25;
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
    <section className="relative h-[68vh] w-full overflow-hidden bg-surface sm:h-[80vh]">
      <div
        ref={fotoRef}
        className="absolute inset-x-0 -top-16 flex justify-center will-change-transform"
      >
        <Image
          src={imagemUrl}
          alt={alt}
          width={1254}
          height={1254}
          priority
          className="h-auto w-full max-w-3xl object-contain sm:max-w-4xl"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
    </section>
  );
}
