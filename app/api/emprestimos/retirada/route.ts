import { NextResponse } from 'next/server';
import { db } from '../../../../src/index';
import { booksTable, loansTable } from '../../../../src/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getSessionUser } from '../../../../src/utils/auth';

export async function POST(request: Request) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        if (user.role !== "user") {
            return NextResponse.json({ error: "Apenas usuários com perfil comum podem realizar retiradas" }, { status: 403 });
        }

        const data = await request.json();
        const { bookId } = data;

        if (!bookId) {
            return NextResponse.json({ error: "ID do livro é obrigatório" }, { status: 400 });
        }
        const result = await db.transaction(async (tx) => {
            const [book] = await tx
                .select()
                .from(booksTable)
                .where(eq(booksTable.id, bookId))
                .limit(1);

            if (!book) {
                return { error: "Livro não encontrado", status: 404 };
            }

            // 2. Contar quantos empréstimos ativos existem para este livro
            const activeLoans = await tx
                .select()
                .from(loansTable)
                .where(
                    and(
                        eq(loansTable.bookId, bookId),
                        isNull(loansTable.returnedAt)
                    )
                );

            const activeCount = activeLoans.length;

            // 3. Verificar se o usuário já tem um empréstimo ativo deste mesmo livro
            const userActiveLoansForBook = activeLoans.filter(loan => loan.userId === user.id);
            if (userActiveLoansForBook.length > 0) {
                return { error: "Você já possui um empréstimo ativo deste livro", status: 400 };
            }

            // 4. Verificar se há estoque disponível
            if (activeCount >= book.quantity) {
                return { error: "Não há exemplares disponíveis deste livro no momento", status: 400 };
            }

            // 5. Inserir o novo empréstimo
            const [newLoan] = await tx
                .insert(loansTable)
                .values({
                    userId: user.id,
                    bookId: bookId,
                })
                .returning();

            return { success: true, loan: newLoan };
        });

        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json({ message: "Retirada realizada com sucesso", loan: result.loan }, { status: 201 });
    } catch (error) {
        console.error("Erro ao realizar retirada:", error);
        return NextResponse.json({ error: "Erro interno no servidor ao processar retirada" }, { status: 500 });
    }
}
