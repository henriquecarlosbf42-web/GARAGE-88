import { createClient } from "@/lib/supabase/server";
import { SairButton } from "@/components/painel/SairButton";
import { PedidosTable, type Pedido } from "@/components/painel/PedidosTable";

export default async function PainelPage() {
  const supabase = await createClient();

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Pedido[]>();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wide">
          Pedidos — Garage 88
        </h1>
        <SairButton />
      </div>
      <PedidosTable pedidosIniciais={pedidos ?? []} />
    </main>
  );
}
