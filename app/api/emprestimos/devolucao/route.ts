import { NextResponse } from 'next/server';
import { db } from '../../../../src/index';
import { loansTable } from '../../../../src/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getSessionUser } from '../../../../src/utils/auth';

export async function POST(request: Request) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        if (user.role !== "user") {
            return NextResponse.json({ error: "Apenas usuários com perfil comum podem realizar devoluções" }, { status: 403 });
        }

        const data = await request.json();
        const { bookId, loanId } = data;

        if (!bookId && !loanId) {
            return NextResponse.json({ error: "É necessário fornecer o ID do livro (bookId) ou o ID do empréstimo (loanId)" }, { status: 400 });
        }

        // Buscar empréstimo ativo
        let condition;
        if (loanId) {
            condition = and(
                eq(loansTable.id, loanId),
                eq(loansTable.userId, user.id),
                isNull(loansTable.returnedAt)
            );
        } else {
            condition = and(
                eq(loansTable.bookId, bookId),
                eq(loansTable.userId, user.id),
                isNull(loansTable.returnedAt)
            );
        }

        const [activeLoan] = await db
            .select()
            .from(loansTable)
            .where(condition)
            .limit(1);

        if (!activeLoan) {
            return NextResponse.json({ error: "Nenhum empréstimo ativo encontrado para este livro/usuário" }, { status: 404 });
        }

        // Registrar devolução
        const [updatedLoan] = await db
            .update(loansTable)
            .set({
                returnedAt: new Date(),
            })
            .where(eq(loansTable.id, activeLoan.id))
            .returning();

        return NextResponse.json({ message: "Livro devolvido com sucesso", loan: updatedLoan }, { status: 200 });
    } catch (error) {
        console.error("Erro ao realizar devolução:", error);
        return NextResponse.json({ error: "Erro interno no servidor ao processar devolução" }, { status: 500 });
    }
}
