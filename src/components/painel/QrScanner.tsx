"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ELEMENTO_ID = "leitor-qr-garage88";

function mensagemErro(erro: unknown): string {
  const texto = String(
    erro instanceof Error ? erro.message : erro ?? "",
  ).toLowerCase();

  if (texto.includes("permission") || texto.includes("notallowed")) {
    return "Permissão da câmera negada. Precisa liberar o acesso à câmera nas configurações do navegador.";
  }
  if (texto.includes("notfound") || texto.includes("no camera")) {
    return "Nenhuma câmera encontrada nesse aparelho.";
  }
  if (texto.includes("notreadable")) {
    return "A câmera está sendo usada por outro app. Fecha o outro app e tenta de novo.";
  }
  if (!window.isSecureContext) {
    return "A câmera só funciona em conexão segura (https). Confere se o link começa com https://.";
  }
  return `Não deu pra abrir a câmera (${String(erro instanceof Error ? erro.message : erro)}).`;
}

export function QrScanner({
  onScan,
  onFechar,
}: {
  onScan: (texto: string) => void;
  onFechar: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const pausadoRef = useRef(false);
  const [erro, setErro] = useState<string | null>(null);

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
      .catch((e) => {
        setErro(mensagemErro(e));
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
      {erro ? (
        <div className="max-w-sm text-center">
          <p className="text-4xl">⚠️</p>
          <p className="mt-4 text-red-300">{erro}</p>
        </div>
      ) : (
        <>
          <div id={ELEMENTO_ID} className="w-full max-w-sm overflow-hidden rounded-2xl" />
          <p className="mt-4 text-sm text-muted">Aponte a câmera pro QR do ticket</p>
        </>
      )}
      <button
        onClick={onFechar}
        className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:border-white/40"
      >
        Fechar
      </button>
    </div>
  );
}
