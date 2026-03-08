import { NextResponse } from "next/server";
import { db } from "../../../src/index";
import { usersTable } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = process.env.JWT_SECRET || "chave_padrao_segura";
const SECRET_KEY = new TextEncoder().encode(secret);

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30min") // Expira em 30 minutos.
      .sign(SECRET_KEY);

    return NextResponse.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    );
  }
}
