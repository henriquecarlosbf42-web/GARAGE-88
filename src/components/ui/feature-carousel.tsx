"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ProdutoFeature {
  id: string;
  nome: string;
  imagem: string | null;
  ingredientes: string | null;
}

const AUTO_PLAY_INTERVAL = 3500;
const ITEM_HEIGHT = 64;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel({
  produtos,
  hrefPedir,
}: {
  produtos: ProdutoFeature[];
  hrefPedir: string;
}) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = produtos.length;
  const currentIndex = total > 0 ? ((step % total) + total) % total : 0;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + total) % total;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused, total]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff -= total;
    if (diff < -total / 2) normalizedDiff += total;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  if (total === 0) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[2.5rem] border border-white/10 lg:aspect-video lg:min-h-0 lg:flex-row">
        {/* Lista de produtos (rótulos) */}
        <div className="relative flex min-h-[220px] w-full flex-col items-start justify-center overflow-hidden bg-background px-8 md:px-12 lg:h-full lg:w-[36%] lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-12 bg-gradient-to-b from-background via-background/80 to-transparent lg:h-16" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-12 bg-gradient-to-t from-background via-background/80 to-transparent lg:h-16" />

          <div className="relative z-20 flex h-full w-full items-center justify-center lg:justify-start">
            {produtos.map((produto, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(-(total / 2), total / 2, distance);

              return (
                <motion.div
                  key={produto.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative rounded-full border px-7 py-3.5 text-left text-base font-semibold uppercase tracking-wide transition-all duration-500",
                      isActive
                        ? "border-accent bg-accent text-background"
                        : "border-white/15 text-muted hover:border-white/30 hover:text-foreground",
                    )}
                  >
                    {produto.nome}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Foto em destaque + ingredientes */}
        <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden border-t border-white/10 bg-surface px-6 py-10 lg:h-full lg:border-l lg:border-t-0 lg:px-10">
          <div className="relative flex aspect-[4/5] w-full max-w-[380px] items-center justify-center">
            {produtos.map((produto, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={produto.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -80 : isNext ? 80 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 origin-center overflow-hidden rounded-[2rem] border-4 border-background bg-background"
                >
                  {produto.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className={cn(
                        "h-full w-full object-cover transition-all duration-700",
                        isActive ? "grayscale-0 blur-0" : "brightness-75 grayscale blur-[2px]",
                      )}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                      Sem foto
                    </div>
                  )}

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24"
                      >
                        <p className="font-heading text-2xl uppercase tracking-wide text-white drop-shadow-md">
                          {produto.nome}
                        </p>
                        {produto.ingredientes && (
                          <p className="mt-1 text-base leading-snug text-white/80">
                            {produto.ingredientes}
                          </p>
                        )}
                        <a
                          href={hrefPedir}
                          className="pointer-events-auto mt-4 inline-block w-fit rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black"
                        >
                          Pedir
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
