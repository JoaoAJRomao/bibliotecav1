import { db } from "../index";
import { usersTable, booksTable } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Populando banco de dados para testes...");
  const hashedPassword = await bcrypt.hash("123", 10);
  
  // Criar Usuário Comum
  await db.insert(usersTable).values({
    name: "Usuário Comum",
    email: "user@email.com",
    password: hashedPassword,
    role: "user",
  }).onConflictDoNothing();

  // Criar Administrador
  await db.insert(usersTable).values({
    name: "Administrador",
    email: "admin@email.com",
    password: hashedPassword,
    role: "admin",
  }).onConflictDoNothing();

  // Criar Livros com estoques diferentes para testes
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
  ]).onConflictDoNothing();

  console.log("✅ Dados de teste (admin, user e livros) criados com sucesso!");
  process.exit(0);
}

seed();