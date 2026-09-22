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
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  ({ className, imageUrl, name, description, price, hrefPedir }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface",
          className,
        )}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        whileHover="hover"
      >
        <div className="relative overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-background text-xs text-muted">
              Sem foto
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <motion.a
              href={hrefPedir}
              className="rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wide text-background opacity-100 shadow-lg shadow-black/40 transition-all duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                Pedir
              </span>
            </motion.a>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-5">
          <h3 className="font-heading text-xl uppercase tracking-wide">{name}</h3>
          {description && <p className="text-sm text-muted">{description}</p>}
          {price != null && (
            <p className="mt-1 font-semibold text-accent-2">R$ {price.toFixed(2)}</p>
          )}
        </div>
      </motion.div>
    );
  },
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };
