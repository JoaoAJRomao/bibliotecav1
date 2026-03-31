import { db } from "@/app/src";
import { booksTable } from "@/app/src/db/schema";
import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";

test.describe("Navegação e Livros", () => {
  let livroDisponivelId: number;
  let livroEsgotadoId: number;

  test.beforeAll(async ({ page }) => {
    const res1 = await db.insert(booksTable).values({
      title: "Livro com Estoque",
      author: "Autor Teste",
      year: 2024,
      publisher: "Editora",
      totalQuantity: 5,
      availableQuantity: 1 // Apenas 1 disponível
    }).returning({ id: booksTable.id });
    livroDisponivelId = res1[0].id;

    const res2 = await db.insert(booksTable).values({
      title: "Livro Esgotado",
      author: "Autor Teste",
      year: 2024,
      publisher: "Editora",
      totalQuantity: 2,
      availableQuantity: 0 // Esgotado
    }).returning({ id: booksTable.id });
    livroEsgotadoId = res2[0].id;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.fill("#email-input", "e2e@email.com");
    await page.fill("#password-input", "123");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*\/livros/);
  });

  test.afterAll(async () => {
    await db.delete(booksTable).where(eq(booksTable.id, livroDisponivelId));
    await db.delete(booksTable).where(eq(booksTable.id, livroEsgotadoId));
  });

  test("deve impedir acesso a /livros se o usuário deslogar", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.reload();
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("deve permitir alugar um livro quando houver disponibilidade", async ({ page }) => {
    await page.click(`#alugar-button-${livroDisponivelId}`);
    await expect(page.locator(`#alugar-button-${livroDisponivelId}`)).toBeEnabled();
  });
  test("deve impedir alugar um livro quando não houver disponibilidade", async ({ page }) => {
    await page.click(`#alugar-button-${livroEsgotadoId}`);
    await expect(page.locator(`#alugar-button-${livroEsgotadoId}`)).toBeDisabled();
  });
});
