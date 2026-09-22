"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Pedido } from "@/lib/pedidos";

export function QrCodePedido({ pedido }: { pedido: Pedido }) {
  return (
    <main className="mx-auto flex max-w-sm flex-col items-center px-6 py-10 text-center print:py-0">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
        Garage 88
      </p>
      <h1 className="mt-1 font-heading text-2xl uppercase tracking-wide">
        Ticket de entrega
      </h1>

      <div className="mt-6 rounded-2xl bg-white p-4">
        <QRCodeSVG value={pedido.id} size={220} />
      </div>

      <div className="mt-6 w-full text-left text-sm">
        <p className="font-semibold">{pedido.cliente_nome}</p>
        <p className="mt-1 text-muted">{pedido.itens}</p>
        {pedido.endereco_entrega && (
          <p className="mt-1 text-muted">{pedido.endereco_entrega}</p>
        )}
      </div>

      <button
        onClick={() => window.print()}
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-2 print:hidden"
      >
        Imprimir
      </button>
    </main>
  );
}
