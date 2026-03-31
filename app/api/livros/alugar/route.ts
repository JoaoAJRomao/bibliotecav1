import { db } from "../../../src/index";
import { booksTable } from "../../../../app/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { bookId } = await request.json();

  return await db.transaction(async (tx) => {
    const [book] = await tx.select().from(booksTable).where(eq(booksTable.id, bookId)).limit(1);

    if (!book || book.availableQuantity <= 0) {
      return NextResponse.json({ error: "Este livro não possui exemplares disponíveis no momento." }, { status: 400 });
    }

    await tx.update(booksTable)
      .set({ availableQuantity: book.availableQuantity - 1 })
      .where(eq(booksTable.id, bookId));

    return NextResponse.json({ message: "Livro alugado com sucesso!" });
  });
}