import { NextResponse } from 'next/server';
import { db } from '../../src/index';
import { booksTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

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
        const data = await request.json();
        const novoLivro = await db.insert(booksTable).values({
            title: data.title,
            author: data.author,
            year: parseInt(data.year),
            publisher: data.publisher
        }).returning();

        return NextResponse.json(novoLivro[0]);
    } catch (error) {
        console.error("Erro no Banco:", error);
        return NextResponse.json({ error: "Erro ao salvar livro" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, title, author, year, publisher } = data;

        if (!id) {
            return NextResponse.json({ error: "ID do livro é obrigatório" }, { status: 400 });
        }

        const livroAtualizado = await db.update(booksTable)
            .set({
                title,
                author,
                year: parseInt(year),
                publisher
            })
            .where(eq(booksTable.id, id))
            .returning();

        return NextResponse.json(livroAtualizado[0]);
    } catch (error) {
        console.error("Erro ao atualizar livro:", error);
        return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
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
