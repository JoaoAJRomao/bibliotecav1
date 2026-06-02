/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../src/index';
import { usersTable, booksTable, loansTable } from '../../src/db/schema';
import { inArray } from 'drizzle-orm';
import { POST as booksPOST, PUT as booksPUT, DELETE as booksDELETE, GET as booksGET } from '../api/livros/route';
import { POST as loanPOST } from '../api/emprestimos/retirada/route';
import { POST as returnPOST } from '../api/emprestimos/devolucao/route';
import { GET as loansGET } from '../api/emprestimos/route';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET || "esta_e_uma_chave_reserva_muito_longa_para_testes_123";
const SECRET_KEY = new TextEncoder().encode(secret);

async function generateTestToken(user: { id: number, email: string, name: string, role: string }) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30min")
    .sign(SECRET_KEY);
}

interface TestUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

describe('Integração: Controle de Perfis e Empréstimos', () => {
  let regularUser: TestUser;
  let adminToken: string;
  let userToken: string;

  let bookWithStockId: number;
  let bookNoStockId: number;
  
  const createdUserIds: number[] = [];
  const createdBookIds: number[] = [];
  const createdLoanIds: number[] = [];

  beforeAll(async () => {
    // 1. Criar usuários de teste
    const hashedPassword = await bcrypt.hash("123", 10);
    
    const [admin] = await db.insert(usersTable).values({
      name: "Admin Teste",
      email: "test_admin@email.com",
      password: hashedPassword,
      role: "admin",
    }).returning();
    createdUserIds.push(admin.id);

    const [user] = await db.insert(usersTable).values({
      name: "User Teste",
      email: "test_user@email.com",
      password: hashedPassword,
      role: "user",
    }).returning();
    regularUser = user;
    createdUserIds.push(user.id);

    // 2. Gerar tokens
    adminToken = await generateTestToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
    userToken = await generateTestToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    // 3. Criar livros para testes
    const [book1] = await db.insert(booksTable).values({
      title: "Livro com Estoque",
      author: "Autor 1",
      year: 2020,
      publisher: "Editora 1",
      quantity: 1,
    }).returning();
    bookWithStockId = book1.id;
    createdBookIds.push(book1.id);

    const [book2] = await db.insert(booksTable).values({
      title: "Livro Sem Estoque",
      author: "Autor 2",
      year: 2021,
      publisher: "Editora 2",
      quantity: 0,
    }).returning();
    bookNoStockId = book2.id;
    createdBookIds.push(book2.id);
  });

  afterAll(async () => {
    // Limpar empréstimos criados
    if (createdLoanIds.length > 0) {
      await db.delete(loansTable).where(inArray(loansTable.id, createdLoanIds));
    }
    // Limpar livros criados
    if (createdBookIds.length > 0) {
      await db.delete(booksTable).where(inArray(booksTable.id, createdBookIds));
    }
    // Limpar usuários criados
    if (createdUserIds.length > 0) {
      await db.delete(usersTable).where(inArray(usersTable.id, createdUserIds));
    }
  });

  describe('Permissões de Perfil (RBAC) na API de Livros', () => {
    it('deve rejeitar criação de livro para usuário comum (403)', async () => {
      const request = new Request('http://localhost/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          title: "Novo Livro Intruso",
          author: "Hacker",
          year: 2026,
          publisher: "Nenhuma",
          quantity: 10
        }),
      });

      const response = await booksPOST(request);
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Acesso proibido');
    });

    it('deve autorizar criação de livro para admin (200)', async () => {
      const request = new Request('http://localhost/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: "Livro Criado por Admin",
          author: "Admin Sábio",
          year: 2026,
          publisher: "Editora Oficial",
          quantity: 3
        }),
      });

      const response = await booksPOST(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.title).toBe('Livro Criado por Admin');
      
      // Adicionar id do livro criado na lista para limpeza
      createdBookIds.push(data.id);
    });

    it('deve rejeitar modificações (PUT) se não for admin (403)', async () => {
      const request = new Request('http://localhost/api/livros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: bookWithStockId,
          title: "Tentativa de Alteração"
        }),
      });

      const response = await booksPUT(request);
      expect(response.status).toBe(403);
    });

    it('deve rejeitar exclusões (DELETE) se não for admin (403)', async () => {
      const request = new Request(`http://localhost/api/livros?id=${bookWithStockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      const response = await booksDELETE(request);
      expect(response.status).toBe(403);
    });
  });

  describe('Fluxo de Empréstimos e Devoluções', () => {
    let activeLoanId: number;

    it('deve permitir realizar retirada se houver estoque disponível', async () => {
      const request = new Request('http://localhost/api/emprestimos/retirada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ bookId: bookWithStockId }),
      });

      const response = await loanPOST(request);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('Retirada realizada com sucesso');
      expect(data.loan).toBeDefined();
      
      activeLoanId = data.loan.id;
      createdLoanIds.push(activeLoanId);
    });

    it('deve rejeitar segunda retirada do mesmo livro pelo mesmo usuário antes de devolver', async () => {
      const request = new Request('http://localhost/api/emprestimos/retirada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ bookId: bookWithStockId }),
      });

      const response = await loanPOST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Você já possui um empréstimo ativo');
    });

    it('deve rejeitar retirada se o estoque do livro estiver esgotado', async () => {
      const request = new Request('http://localhost/api/emprestimos/retirada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ bookId: bookNoStockId }),
      });

      const response = await loanPOST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Não há exemplares disponíveis');
    });

    it('deve permitir devolver um livro retirado com sucesso', async () => {
      const request = new Request('http://localhost/api/emprestimos/devolucao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ loanId: activeLoanId }),
      });

      const response = await returnPOST(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Livro devolvido com sucesso');
      expect(data.loan.returnedAt).not.toBeNull();
    });

    it('deve permitir realizar retirada novamente após a devolução', async () => {
      // Como o livro de bookWithStockId foi devolvido, a contagem de empréstimos ativos volta a zero
      const request = new Request('http://localhost/api/emprestimos/retirada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ bookId: bookWithStockId }),
      });

      const response = await loanPOST(request);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.loan).toBeDefined();
      
      createdLoanIds.push(data.loan.id);
    });

    it('deve retornar a lista de livros contendo o saldo de cópias disponíveis (availableCopies)', async () => {
      const response = await booksGET();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);

      interface BookResponse {
        id: number;
        availableCopies: number;
      }
      const bookWithStock = data.find((b: BookResponse) => b.id === bookWithStockId);
      const bookNoStock = data.find((b: BookResponse) => b.id === bookNoStockId);

      expect(bookWithStock).toBeDefined();
      expect(bookWithStock.availableCopies).toBe(0);

      expect(bookNoStock).toBeDefined();
      expect(bookNoStock.availableCopies).toBe(0);
    });

    it('deve retornar erro 401 ao buscar empréstimos ativos sem autenticação', async () => {
      const request = new Request('http://localhost/api/emprestimos', {
        method: 'GET',
      });

      const response = await loansGET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Não autorizado');
    });

    it('deve retornar os empréstimos ativos do usuário logado', async () => {
      const request = new Request('http://localhost/api/emprestimos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      const response = await loansGET(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      interface LoanResponse {
        bookId: number;
        userId: number;
        returnedAt: string | null;
        book: { title: string };
      }
      const loan = data.find((l: LoanResponse) => l.bookId === bookWithStockId);
      expect(loan).toBeDefined();
      expect(loan.userId).toBe(regularUser.id);
      expect(loan.returnedAt).toBeNull();
      expect(loan.book).toBeDefined();
      expect(loan.book.title).toBe('Livro com Estoque');
    });
  });
});
