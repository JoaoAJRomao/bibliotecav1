import { NextResponse } from 'next/server';
import { db } from '../../src/index';
import { booksTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '../../src/utils/auth';

export async function GET() {
    try {
        const todosLivros = await db.select().from(booksTable);
        return NextResponse.json(todosLivros);
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
        const novoLivro = await db.insert(booksTable).values({
            title: data.title,
            author: data.author,
            year: parseInt(data.year),
            publisher: data.publisher,
            quantity: data.quantity !== undefined ? parseInt(data.quantity) : 1
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
        const { id, title, author, year, publisher, quantity } = data;

        if (!id) {
            return NextResponse.json({ error: "ID do livro é obrigatório" }, { status: 400 });
        }

        const [updateBook] = await db.update(booksTable)
            .set({ 
                title, 
                author, 
                year: year !== undefined ? parseInt(year) : undefined, 
                publisher,
                quantity: quantity !== undefined ? parseInt(quantity) : undefined
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

