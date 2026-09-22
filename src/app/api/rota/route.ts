import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  geocodificar,
  montarLinkMaps,
  ordenarPorProximidade,
  type ParadaRota,
} from "@/lib/rota";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { ids } = (await request.json()) as { ids?: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ erro: "Nenhum pedido informado." }, { status: 400 });
  }

  // A consulta abaixo passa pelo RLS normal -- só devolve os pedidos que
  // esse usuário (motoboy ou admin) já tem permissão de ver.
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, endereco_entrega, latitude, longitude")
    .in("id", ids);

  if (!pedidos || pedidos.length === 0) {
    return NextResponse.json({ erro: "Pedidos não encontrados." }, { status: 404 });
  }

  const paradas: ParadaRota[] = [];

  for (const pedido of pedidos) {
    if (pedido.latitude != null && pedido.longitude != null) {
      paradas.push({
        id: pedido.id,
        coord: { lat: pedido.latitude, lng: pedido.longitude },
        destino: `${pedido.latitude},${pedido.longitude}`,
      });
      continue;
    }

    if (pedido.endereco_entrega) {
      const coord = await geocodificar(pedido.endereco_entrega);
      paradas.push({
        id: pedido.id,
        coord,
        destino: coord ? `${coord.lat},${coord.lng}` : pedido.endereco_entrega,
      });
      // Respeita o limite de 1 requisição/segundo do Nominatim (OpenStreetMap).
      await new Promise((resolve) => setTimeout(resolve, 1100));
    } else {
      paradas.push({ id: pedido.id, coord: null, destino: "" });
    }
  }

  const ordenadas = ordenarPorProximidade(paradas);
  const destinos = ordenadas.map((p) => p.destino);
  const url = montarLinkMaps(destinos);

  if (!url) {
    return NextResponse.json(
      { erro: "Nenhum pedido selecionado tem endereço ou localização." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, ordem: ordenadas.map((p) => p.id), url });
}
