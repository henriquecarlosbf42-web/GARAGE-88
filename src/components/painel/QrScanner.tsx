"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ELEMENTO_ID = "leitor-qr-garage88";

export function QrScanner({
  onScan,
  onFechar,
}: {
  onScan: (texto: string) => void;
  onFechar: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const pausadoRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(ELEMENTO_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 240 },
        (decodedText) => {
          if (pausadoRef.current) return;
          pausadoRef.current = true;
          onScan(decodedText);
          setTimeout(() => {
            pausadoRef.current = false;
          }, 1500);
        },
        () => {
          // erro de leitura de um frame sem QR -- normal, ignora
        },
      )
      .catch(() => {
        onFechar();
      });

    return () => {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6">
      <div id={ELEMENTO_ID} className="w-full max-w-sm overflow-hidden rounded-2xl" />
      <p className="mt-4 text-sm text-muted">Aponte a câmera pro QR do ticket</p>
      <button
        onClick={onFechar}
        className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:border-white/40"
      >
        Fechar
      </button>
    </div>
  );
}
