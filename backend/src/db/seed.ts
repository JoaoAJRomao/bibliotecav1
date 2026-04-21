import { db } from "../db";
import { usersTable } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Populando banco de dados para testes...");
  const hashedPassword = await bcrypt.hash("123", 10);
  
  await db.insert(usersTable).values({
    name: "Nome de Teste",
    email: "e2e@email.com",
    password: hashedPassword,
  }).onConflictDoNothing();

  console.log("✅ Usuário de teste criado!");
  process.exit(0);
}

seed();