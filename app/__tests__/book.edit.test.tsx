/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../src/index';
import { booksTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { PUT } from '../api/livros/route';

describe('Integração: Edição de Livros', () => {
  let livroId: number;

  // Cria um livro antes de iniciar o teste
  beforeAll(async () => {
    const res = await db.insert(booksTable).values({
      title: "Livro do Balacubaco",
      author: "Parangole",
      year: 2026,
      publisher: "Editora Musical"
    }).returning({ id: booksTable.id });
    
    livroId = res[0].id;
  });

  // Remove o livro após o teste para manter o banco limpo
  afterAll(async () => {
    if (livroId) {
      await db.delete(booksTable).where(eq(booksTable.id, livroId));
    }
  });

  it('deve atualizar o título e o autor de um livro existente via API', async () => {
    const novosDados = {
      id: livroId,
      title: "Título Atualizado",
      author: "Autor Novo"
    };

    // Simula a requisição PUT para a rota de livros
    const request = new Request(`http://localhost/api/livros`, {
      method: 'PUT',
      body: JSON.stringify(novosDados),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Validação no Banco
    const [livroNoBanco] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, livroId))
      .limit(1);

    expect(livroNoBanco.title).toBe("Título Atualizado");
    expect(livroNoBanco.author).toBe("Autor Novo");
  });
});