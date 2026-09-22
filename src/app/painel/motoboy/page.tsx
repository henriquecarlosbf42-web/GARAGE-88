import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SairButton } from "@/components/painel/SairButton";
import { MotoboyView } from "@/components/painel/MotoboyView";
import type { Pedido } from "@/lib/pedidos";

export default async function PainelMotoboyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "motoboy") {
    redirect("/painel");
  }

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<Pedido[]>();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wide">
          Entregas — Garage 88
        </h1>
        <SairButton />
      </div>
      <MotoboyView pedidosIniciais={pedidos ?? []} userId={user!.id} />
    </main>
  );
}
