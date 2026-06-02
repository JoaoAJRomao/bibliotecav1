import { NextResponse } from 'next/server';
import { db } from '../../../src/index';
import { booksTable, loansTable } from '../../../src/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { getSessionUser } from '../../../src/utils/auth';

export async function GET() {
    try {
        const todosLivros = await db.select().from(booksTable);
        const activeLoans = await db.select({
            bookId: loansTable.bookId,
        }).from(loansTable).where(isNull(loansTable.returnedAt));

        const activeLoanCounts: Record<number, number> = {};
        for (const loan of activeLoans) {
            activeLoanCounts[loan.bookId] = (activeLoanCounts[loan.bookId] || 0) + 1;
        }

        const livrosComSaldo = todosLivros.map(book => {
            const activeCount = activeLoanCounts[book.id] || 0;
            return {
                ...book,
                availableCopies: Math.max(0, book.quantity - activeCount),
            };
        });

        return NextResponse.json(livrosComSaldo);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        return NextResponse.json({ error: "Erro ao recuperar dados" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Acesso proibido" }, { status: 403 });
        }

        const data = await request.json();
        const isbn = data.isbn ? String(data.isbn).trim() : null;
        const imageUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null;

        const novoLivro = await db.insert(booksTable).values({
            title: data.title,
            author: data.author,
            year: parseInt(data.year),
            publisher: data.publisher,
            quantity: data.quantity !== undefined ? parseInt(data.quantity) : 1,
            isbn,
            imageUrl
        }).returning();

        return NextResponse.json(novoLivro[0]);
    } catch (error) {
        console.error("Erro no Banco:", error);
        return NextResponse.json({ error: "Erro ao salvar livro" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Acesso proibido" }, { status: 403 });
        }

        const data = await request.json();
        const { id, title, author, year, publisher, quantity, isbn } = data;

        if (!id) {
            return NextResponse.json({ error: "ID do livro é obrigatório" }, { status: 400 });
        }

        let imageUrl: string | undefined | null = undefined;
        if (isbn !== undefined) {
            imageUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${String(isbn).trim()}-M.jpg` : null;
        }

        const [updateBook] = await db.update(booksTable)
            .set({ 
                title, 
                author, 
                year: year !== undefined ? parseInt(year) : undefined, 
                publisher,
                quantity: quantity !== undefined ? parseInt(quantity) : undefined,
                isbn: isbn !== undefined ? (isbn ? String(isbn).trim() : null) : undefined,
                imageUrl: imageUrl
            })
            .where(eq(booksTable.id, id))
            .returning();

        if (!updateBook) {
            return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
        }   
        return NextResponse.json(updateBook, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar livro:", error);
        return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Acesso proibido" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
        }

        await db.delete(booksTable)
            .where(eq(booksTable.id, parseInt(id)));

        return NextResponse.json({ message: "Livro removido com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar livro:", error);
        return NextResponse.json({ error: "Erro interno ao deletar" }, { status: 500 });
    }
}

