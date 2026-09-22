import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com privilegios de administrador (ignora RLS). Usar SOMENTE em
// codigo de servidor (API routes, Server Actions) -- o import "server-only"
// acima faz o build falhar se isso acabar sendo importado num componente
// de cliente por engano.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
