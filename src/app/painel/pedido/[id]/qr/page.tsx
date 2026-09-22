import { createClient } from "@/lib/supabase/server";
import { QrCodePedido } from "@/components/painel/QrCodePedido";
import type { Pedido } from "@/lib/pedidos";

export default async function QrPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", id)
    .single<Pedido>();

  if (!pedido) {
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-muted">Pedido não encontrado.</p>
      </main>
    );
  }

  return <QrCodePedido pedido={pedido} />;
}
