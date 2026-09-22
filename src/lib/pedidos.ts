export type Pedido = {
  id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  endereco_entrega: string | null;
  itens: string;
  observacoes: string | null;
  status: string;
  origem: string;
  valor_total: number | null;
  taxa_entrega: number | null;
  forma_pagamento: string | null;
  motoboy_id: string | null;
  created_at: string;
};

export const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  pix: "Pix",
};

export const STATUS_OPCOES = [
  "novo",
  "em_preparo",
  "saiu_para_entrega",
  "concluido",
  "cancelado",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_preparo: "Em preparo",
  saiu_para_entrega: "Saiu pra entrega",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function normalizarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.startsWith("55")) return digitos;
  return `55${digitos}`;
}

export function linkRastreio(pedido: Pedido, origin: string) {
  return `${origin}/pedido/${pedido.id}`;
}

export function linkWhatsapp(pedido: Pedido, origin: string) {
  if (!pedido.cliente_telefone) return null;
  const numero = normalizarTelefone(pedido.cliente_telefone);
  const primeiroNome = pedido.cliente_nome.split(" ")[0];
  const link = linkRastreio(pedido, origin);

  const mensagem =
    pedido.status === "saiu_para_entrega"
      ? `Oi ${primeiroNome}! Seu pedido da Garage 88 saiu pra entrega 🛵 Prepare-se pra receber! Acompanhe aqui: ${link}`
      : `Oi ${primeiroNome}! Recebemos seu pedido na Garage 88 🍔 Acompanhe o andamento aqui: ${link}`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkRotaGoogleMaps(enderecos: string[]) {
  if (enderecos.length === 0) return null;
  const destino = encodeURIComponent(enderecos[enderecos.length - 1]);
  const paradas = enderecos
    .slice(0, -1)
    .map((e) => encodeURIComponent(e))
    .join("|");
  const params = new URLSearchParams({
    api: "1",
    destination: destino,
    travelmode: "driving",
  });
  let url = `https://www.google.com/maps/dir/?${params.toString()}`;
  if (paradas) url += `&waypoints=${paradas}`;
  return url;
}
