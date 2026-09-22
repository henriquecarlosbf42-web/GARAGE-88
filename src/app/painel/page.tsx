import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SairButton } from "@/components/painel/SairButton";
import { PedidosTable } from "@/components/painel/PedidosTable";
import type { Pedido } from "@/lib/pedidos";

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role === "motoboy") {
    redirect("/painel/motoboy");
  }

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
        <div className="flex items-center gap-3">
          <Link
            href="/painel/equipe"
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-white/40"
          >
            Equipe
          </Link>
          <Link
            href="/painel/novo"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-2"
          >
            Novo pedido
          </Link>
          <SairButton />
        </div>
      </div>
      <PedidosTable pedidosIniciais={pedidos ?? []} />
    </main>
  );
}
