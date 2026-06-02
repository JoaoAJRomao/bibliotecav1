import { db } from "../../src/index";
import { usersTable, booksTable } from "../../src/db/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function resetDatabase() {
  // Truncate tables to ensure total test isolation
  await db.execute(sql`TRUNCATE TABLE loans, books, users RESTART IDENTITY CASCADE;`);

  const hashedPassword = await bcrypt.hash("123", 10);
  
  // Re-seed standard users
  await db.insert(usersTable).values([
    {
      name: "Usuário Comum",
      email: "user@email.com",
      password: hashedPassword,
      role: "user",
    },
    {
      name: "Administrador",
      email: "admin@email.com",
      password: hashedPassword,
      role: "admin",
    }
  ]);

  // Re-seed standard books
  await db.insert(booksTable).values([
    {
      title: "O Senhor dos Anéis",
      author: "J.R.R. Tolkien",
      year: 1954,
      publisher: "Allen & Unwin",
      quantity: 5,
      isbn: "9788578270698",
      imageUrl: "https://covers.openlibrary.org/b/isbn/9788578270698-M.jpg"
    },
    {
      title: "1984 (Exemplar Único)",
      author: "George Orwell",
      year: 1949,
      publisher: "Secker & Warburg",
      quantity: 1,
      isbn: "9788535914849",
      imageUrl: "https://covers.openlibrary.org/b/isbn/9788535914849-M.jpg"
    },
    {
      title: "Livro Indisponível (Sem Estoque)",
      author: "Autor Desconhecido",
      year: 2020,
      publisher: "Editora Fantasma",
      quantity: 0,
      isbn: null,
      imageUrl: null
    }
  ]);
}
