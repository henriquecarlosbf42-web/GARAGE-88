import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ erro: "Só admin pode cadastrar equipe." }, { status: 403 });
  }

  const body = await request.json();
  const { email, senha, nome, role } = body as {
    email?: string;
    senha?: string;
    nome?: string;
    role?: string;
  };

  if (!email || !senha || !role) {
    return NextResponse.json({ erro: "Email, senha e papel são obrigatórios." }, { status: 400 });
  }

  if (senha.length < 6) {
    return NextResponse.json({ erro: "Senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }

  if (role !== "admin" && role !== "motoboy") {
    return NextResponse.json({ erro: "Papel inválido." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: novoUsuario, error: erroCriar } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });

  if (erroCriar || !novoUsuario.user) {
    return NextResponse.json(
      { erro: erroCriar?.message ?? "Não deu pra criar o usuário." },
      { status: 400 },
    );
  }

  const { error: erroPerfil } = await admin
    .from("profiles")
    .update({ role, nome: nome || email })
    .eq("id", novoUsuario.user.id);

  if (erroPerfil) {
    return NextResponse.json(
      { erro: "Usuário criado, mas não deu pra definir o papel dele." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: novoUsuario.user.id });
}
