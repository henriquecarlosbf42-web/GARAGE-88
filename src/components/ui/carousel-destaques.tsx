"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProdutoSlide {
  id: string;
  imagem: string | null;
  nome: string;
  descricao: string | null;
  preco: number | null;
}

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

export function CarouselDestaques({
  produtos,
  hrefPedir,
}: {
  produtos: ProdutoSlide[];
  hrefPedir: string;
}) {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);

  const total = produtos.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  if (total === 0) return null;

  return (
    <div className="flex w-full select-none flex-col items-center justify-center overflow-hidden py-6">
      <div className="relative flex h-80 w-full max-w-7xl items-center justify-center sm:h-112 lg:h-128">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
        />

        {produtos.map((produto, i) => (
          <CardCarrossel
            key={produto.id}
            produto={produto}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            hrefPedir={hrefPedir}
          />
        ))}
      </div>
      {total > 1 && (
        <p className="mt-4 text-xs uppercase tracking-widest text-muted">
          Arraste pros lados pra ver mais
        </p>
      )}
    </div>
  );
}

function CardCarrossel({
  produto,
  index,
  total,
  progress,
  config,
  hrefPedir,
}: {
  produto: ProdutoSlide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  hrefPedir: string;
}) {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * config.scaleReduction);
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));
  const textoOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);
  const escurecerOpacity = useTransform(offset, [-2, -0.5, 0, 0.5, 2], [0.5, 0.2, 0, 0.2, 0.5]);

  return (
    <motion.div
      style={{ x, rotate, y, scale, opacity, zIndex }}
      className={cn(
        "group pointer-events-none absolute overflow-hidden rounded-2xl bg-surface",
        "h-56 w-44 sm:h-80 sm:w-56 lg:h-96 lg:w-64",
      )}
    >
      {produto.imagem ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">
          Sem foto
        </div>
      )}

      <motion.div
        style={{ opacity: escurecerOpacity }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {produto.preco != null && (
        <Badge className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-black backdrop-blur-md sm:right-5 sm:top-5 sm:px-3 sm:py-1 lg:right-6 lg:top-6">
          R$ {produto.preco.toFixed(2)}
        </Badge>
      )}

      <div className="absolute inset-x-3 bottom-5 text-center text-white sm:inset-x-5 sm:bottom-8 sm:text-left lg:inset-x-6 lg:bottom-10">
        <motion.p
          style={{ opacity: textoOpacity }}
          className="mb-0.5 text-sm font-bold leading-tight drop-shadow-md sm:mb-1 sm:text-lg lg:text-xl"
        >
          {produto.nome}
        </motion.p>
        <motion.p
          style={{ opacity: textoOpacity }}
          className="hidden text-xs font-medium italic text-white/70 sm:line-clamp-2 sm:block"
        >
          {produto.descricao}
        </motion.p>
        <motion.a
          href={hrefPedir}
          style={{ opacity: textoOpacity }}
          className="pointer-events-auto mt-2 hidden rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black sm:inline-block"
        >
          Pedir
        </motion.a>
      </div>
    </motion.div>
  );
}
