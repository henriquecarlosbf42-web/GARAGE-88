import "server-only";

// Coordenada aproximada da Garage 88 (Av. Rui Barbosa, 1234, Santana, São
// José dos Campos - SP). O OpenStreetMap não tem o número exato mapeado,
// então isso é o ponto da rua/região -- preciso o suficiente pra decidir
// "qual parada está mais perto", que é o único uso disso.
export const LOJA = { lat: -23.1679944, lng: -45.8927787 };

export type Coord = { lat: number; lng: number };

export async function geocodificar(endereco: string): Promise<Coord | null> {
  const params = new URLSearchParams({
    q: endereco,
    format: "json",
    limit: "1",
    countrycodes: "br",
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        "User-Agent": "Garage88-App/1.0 (contato: henriquecarlosbf42@gmail.com)",
      },
    });
    const dados = await res.json();
    if (!Array.isArray(dados) || dados.length === 0) return null;
    return { lat: parseFloat(dados[0].lat), lng: parseFloat(dados[0].lon) };
  } catch {
    return null;
  }
}

function distanciaKm(a: Coord, b: Coord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export type ParadaRota = {
  id: string;
  coord: Coord | null;
  destino: string;
};

// Ordena as paradas pelo algoritmo do "vizinho mais próximo": a cada passo,
// escolhe a parada restante mais perto de onde o motoboy "está" no momento
// (começando na loja). Não é o ótimo matemático absoluto, mas é uma rota
// bem razoável e roda instantaneamente, sem precisar de API paga.
export function ordenarPorProximidade(paradas: ParadaRota[]): ParadaRota[] {
  const comCoord = paradas.filter((p): p is ParadaRota & { coord: Coord } => p.coord !== null);
  const semCoord = paradas.filter((p) => p.coord === null);

  const restantes = [...comCoord];
  const ordenadas: ParadaRota[] = [];
  let atual: Coord = LOJA;

  while (restantes.length > 0) {
    let melhorIndice = 0;
    let melhorDistancia = Infinity;
    restantes.forEach((parada, indice) => {
      const distancia = distanciaKm(atual, parada.coord);
      if (distancia < melhorDistancia) {
        melhorDistancia = distancia;
        melhorIndice = indice;
      }
    });
    const [proxima] = restantes.splice(melhorIndice, 1);
    ordenadas.push(proxima);
    atual = proxima.coord;
  }

  return [...ordenadas, ...semCoord];
}

export function montarLinkMaps(destinos: string[]): string | null {
  const validos = destinos.filter((d) => d.trim().length > 0);
  if (validos.length === 0) return null;

  const destino = encodeURIComponent(validos[validos.length - 1]);
  const paradas = validos
    .slice(0, -1)
    .map((d) => encodeURIComponent(d))
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
