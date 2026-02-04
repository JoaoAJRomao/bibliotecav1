import { NextResponse } from 'next/server';
import { db } from '../../src/index';
import { booksTable } from '../../src/db/schema';

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