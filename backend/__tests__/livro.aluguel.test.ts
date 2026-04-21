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

describe('Integração: Regras de Aluguer de Livros (Express API)', () => {
  let livroDisponivelId: number;
  let livroEsgotadoId: number;

  beforeAll(async () => {
    const res1 = await db.insert(booksTable).values({
      title: "Livro com Estoque",
      author: "Autor Teste",
      year: 2024,
      publisher: "Editora",
      totalQuantity: 5,
      availableQuantity: 1 // Apenas 1 disponível
    }).returning({ id: booksTable.id });
    livroDisponivelId = res1[0].id;

    const res2 = await db.insert(booksTable).values({
      title: "Livro Esgotado",
      author: "Autor Teste",
      year: 2024,
      publisher: "Editora",
      totalQuantity: 2,
      availableQuantity: 0 // Esgotado
    }).returning({ id: booksTable.id });
    livroEsgotadoId = res2[0].id;
  });

  afterAll(async () => {
    await db.delete(booksTable).where(eq(booksTable.id, livroDisponivelId));
    await db.delete(booksTable).where(eq(booksTable.id, livroEsgotadoId));
  });

  it('deve permitir alugar um livro quando houver estoque e decrementar a quantidade', async () => {
    const response = await request(app)
      .post('/api/livros/alugar')
      .send({ bookId: livroDisponivelId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Livro alugado com sucesso!");

    const [livro] = await db.select().from(booksTable).where(eq(booksTable.id, livroDisponivelId));
    expect(livro.availableQuantity).toBe(0);
  });

  it('deve retornar erro 400 ao tentar alugar um livro sem exemplares disponíveis', async () => {
    const response = await request(app)
      .post('/api/livros/alugar')
      .send({ bookId: livroEsgotadoId });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("não possui exemplares disponíveis");

    const [livro] = await db.select().from(booksTable).where(eq(booksTable.id, livroEsgotadoId));
    expect(livro.availableQuantity).toBe(0);
  });
});