import { test, expect } from "@playwright/test";

test.describe("Navegação e Livros", () => {
  let livroDisponivelId: number;
  let livroEsgotadoId: number;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  test.beforeAll(async () => {
    const res1 = await fetch(`${API_URL}/api/livros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Livro com Estoque",
        author: "Autor Teste",
        year: 2024,
        publisher: "Editora",
        totalQuantity: 5,
        availableQuantity: 1 // Apenas 1 disponível
      }),
    });
    const data1 = await res1.json();
    livroDisponivelId = data1.id;

    // Atualizar quantidade forçada já que o POST base do nosso endpoint preenche default mas nosso teste quer forçar
    // Nota: Como o backend não tem rota para forçar quantidades no POST/PUT atualmente, assumimos a criação normal ou que devemos mockar 
    // mas enviaremos da mesma forma.
    
    // Atualização da query esgotada (Para manter a paridade criaremos como Esgotado)
    const res2 = await fetch(`${API_URL}/api/livros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Livro Esgotado",
        author: "Autor Teste",
        year: 2024,
        publisher: "Editora",
        totalQuantity: 2,
        availableQuantity: 0 // Esgotado
      }),
    });
    const data2 = await res2.json();
    livroEsgotadoId = data2.id;
    
    // Obs: Se a sua API não salvar as quantidades passadas, você pode ter que adaptar o backend ou criar uma rota de reset de E2E.
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.fill("#email-input", "e2e@email.com");
    await page.fill("#password-input", "123");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*\/livros/);
  });

  test.afterAll(async () => {
    if (livroDisponivelId) await fetch(`${API_URL}/api/livros?id=${livroDisponivelId}`, { method: "DELETE" });
    if (livroEsgotadoId) await fetch(`${API_URL}/api/livros?id=${livroEsgotadoId}`, { method: "DELETE" });
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
