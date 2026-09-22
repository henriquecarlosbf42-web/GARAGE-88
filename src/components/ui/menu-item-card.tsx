"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  className?: string;
  imageUrl?: string | null;
  name: string;
  description?: string | null;
  price?: number | null;
  hrefPedir: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  ({ className, imageUrl, name, description, price, hrefPedir }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex w-full flex-col items-center rounded-2xl border border-white/10 bg-surface px-5 pb-6 pt-24 text-center",
          className,
        )}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* Foto "flutuando" pra fora do topo do card, com sombra pra dar profundidade */}
        <div className="absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-105">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full rounded-2xl object-cover shadow-[0_20px_35px_-10px_rgba(0,0,0,0.7)]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background text-xs text-muted shadow-[0_20px_35px_-10px_rgba(0,0,0,0.7)]">
              Sem foto
            </div>
          )}
        </div>

        <h3 className="font-heading text-xl uppercase tracking-wide">{name}</h3>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        {price != null && (
          <p className="mt-2 font-semibold text-accent-2">R$ {price.toFixed(2)}</p>
        )}

        <motion.a
          href={hrefPedir}
          className="mt-4 rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wide text-background shadow-lg shadow-black/40 transition hover:bg-accent-2"
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Pedir
          </span>
        </motion.a>
      </motion.div>
    );
  },
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };
