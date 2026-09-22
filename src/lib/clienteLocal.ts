const CHAVE = "garage88_cliente";

export type ClienteLocal = {
  nome: string;
  telefone: string;
  endereco: string;
};

export function lerClienteLocal(): ClienteLocal | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    return JSON.parse(bruto) as ClienteLocal;
  } catch {
    return null;
  }
}

export function salvarClienteLocal(cliente: ClienteLocal) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cliente));
  } catch {
    // localStorage indisponível (modo privado etc) -- segue sem lembrar
  }
}

export function limparClienteLocal() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // ignora
  }
}
