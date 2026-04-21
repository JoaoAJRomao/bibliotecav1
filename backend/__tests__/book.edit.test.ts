/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { db } from '../src/db';
import { booksTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import livrosRoutes from '../src/routes/livros';

const app = express();
app.use(express.json());
app.use('/api/livros', livrosRoutes);

describe('Integração: Edição de Livros (Express API)', () => {
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

  it('deve atualizar o título e o autor de um livro existente via API Express', async () => {
    const novosDados = {
      id: livroId,
      title: "Título Atualizado Express",
      author: "Autor Novo Express"
    };

    // Usando Supertest para testar o router Express como se fosse uma requisição real HTTP PUT
    const response = await request(app)
      .put('/api/livros')
      .send(novosDados);

    expect(response.status).toBe(200);

    // Validação no Banco
    const [livroNoBanco] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, livroId))
      .limit(1);

    expect(livroNoBanco.title).toBe("Título Atualizado Express");
    expect(livroNoBanco.author).toBe("Autor Novo Express");
  });
});