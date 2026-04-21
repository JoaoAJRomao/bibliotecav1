import { Router } from 'express';
import { db } from '../db';
import { booksTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const todosLivros = await db.select().from(booksTable);
        return res.json(todosLivros);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        return res.status(500).json({ error: "Erro ao recuperar dados" });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const novoLivro = await db.insert(booksTable).values({
            title: data.title,
            author: data.author,
            year: parseInt(data.year),
            publisher: data.publisher
        }).returning();

        return res.json(novoLivro[0]);
    } catch (error) {
        console.error("Erro no Banco:", error);
        return res.status(500).json({ error: "Erro ao salvar livro" });
    }
});

router.put('/', async (req, res) => {
    try {
        const data = req.body;
        const { id, title, author, year, publisher } = data;

        if (!id) {
            return res.status(400).json({ error: "ID do livro é obrigatório" });
        }

        const [updateBook] = await db.update(booksTable)
            .set({ title, author, year, publisher })
            .where(eq(booksTable.id, id))
            .returning();

        if (!updateBook) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }   
        return res.status(200).json(updateBook);
    } catch (error) {
        console.error("Erro ao atualizar livro:", error);
        return res.status(500).json({ error: "Erro ao atualizar dados" });
    }
});

router.delete('/', async (req, res) => {
    try {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).json({ error: "ID não fornecido" });
        }

        await db.delete(booksTable)
            .where(eq(booksTable.id, parseInt(id)));

        return res.json({ message: "Livro removido com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar livro:", error);
        return res.status(500).json({ error: "Erro interno ao deletar" });
    }
});

router.post('/alugar', async (req, res) => {
  try {
    const { bookId } = req.body;

    const result = await db.transaction(async (tx) => {
      const [book] = await tx.select().from(booksTable).where(eq(booksTable.id, bookId)).limit(1);

      if (!book || book.availableQuantity <= 0) {
        return { error: "Este livro não possui exemplares disponíveis no momento." };
      }

      await tx.update(booksTable)
        .set({ availableQuantity: book.availableQuantity - 1 })
        .where(eq(booksTable.id, bookId));

      return { message: "Livro alugado com sucesso!" };
    });

    if ('error' in result) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    console.error("Erro ao alugar livro:", error);
    return res.status(500).json({ error: "Erro interno ao alugar" });
  }
});

export default router;
