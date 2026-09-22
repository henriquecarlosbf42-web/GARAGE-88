export type Categoria = {
  id: string;
  nome: string;
  ordem: number;
};

export type Produto = {
  id: string;
  categoria_id: string | null;
  nome: string;
  descricao: string | null;
  ingredientes: string | null;
  preco: number | null;
  imagem_url: string | null;
  disponivel: boolean;
  ordem: number;
};
