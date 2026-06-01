import { NextResponse } from "next/server";
import { db } from "../../../src/index";
import { loansTable, booksTable } from "../../../src/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getSessionUser } from "../../../src/utils/auth";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (user.role !== "user") {
      return NextResponse.json(
        { error: "Apenas usuários com perfil comum possuem empréstimos" },
        { status: 403 },
      );
    }

    const activeLoans = await db
      .select({
        id: loansTable.id,
        userId: loansTable.userId,
        bookId: loansTable.bookId,
        borrowedAt: loansTable.borrowedAt,
        returnedAt: loansTable.returnedAt,
        book: {
          id: booksTable.id,
          title: booksTable.title,
          author: booksTable.author,
          year: booksTable.year,
          publisher: booksTable.publisher,
        },
      })
      .from(loansTable)
      .innerJoin(booksTable, eq(loansTable.bookId, booksTable.id))
      .where(
        and(eq(loansTable.userId, user.id), isNull(loansTable.returnedAt)),
      );

    return NextResponse.json(activeLoans);
  } catch (error) {
    console.error("Erro ao buscar empréstimos ativos:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar empréstimos" },
      { status: 500 },
    );
  }
}
