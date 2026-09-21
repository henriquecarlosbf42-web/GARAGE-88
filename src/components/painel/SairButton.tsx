"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SairButton() {
  const router = useRouter();

  async function handleSair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/painel/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSair}
      className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-white/40"
    >
      Sair
    </button>
  );
}
