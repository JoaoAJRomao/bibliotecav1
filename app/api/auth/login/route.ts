import { NextResponse } from "next/server";
import { db } from "../../../src/index";
import { usersTable } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Utilizador não encontrado." },
        { status: 401 },
      );
    }

    const user = users[0];
    // O compare valida se a senha digitada corresponde ao hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    );
  }
}
