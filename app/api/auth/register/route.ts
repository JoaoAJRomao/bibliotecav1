import { NextResponse } from "next/server";
import { db } from "../../../src/index";
import { usersTable } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email)).limit(1);
    if (userExists.length > 0) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 },
      );
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar cadastro." },
      { status: 500 },
    );
  }
}
