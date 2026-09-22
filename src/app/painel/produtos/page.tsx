import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SairButton } from "@/components/painel/SairButton";
import { ProdutosManager } from "@/components/painel/ProdutosManager";
import type { Categoria, Produto } from "@/lib/produtos";

export default async function ProdutosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/painel/motoboy");
  }

  const [{ data: categorias }, { data: produtos }] = await Promise.all([
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
    supabase.from("produtos").select("*").order("ordem").returns<Produto[]>(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wide">
          Cardápio
        </h1>
        <SairButton />
      </div>
      <ProdutosManager
        categoriasIniciais={categorias ?? []}
        produtosIniciais={produtos ?? []}
      />
    </main>
  );
}
