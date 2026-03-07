import { NextResponse } from "next/server";
import { db } from "../../../src/index";
import { usersTable } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userExists.length > 0) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 },
      );
    }

    await db.insert(usersTable).values({
      name,
      email,
      password, // Alterar para bcrypt com hash de senha aqui
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
