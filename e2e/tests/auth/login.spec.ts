import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("localhost:3000");
  });

  test("deve ser bem sucedido com credenciais válidas", async ({ page }) => {
    await page.fill("#email-input", "e2e@email.com");
    await page.fill("#password-input", "123");
    await page.click("#login-button");

    await expect(page).toHaveURL(/.*\/livros/);
  });

  test("deve alertar login vazio ao tentar logar sem preencher os campos", async ({
    page,
  }) => {
    await page.click("#login-button");
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveJSProperty(
      "validationMessage",
      "Please fill out this field.",
    );
  });

  test("deve alertar email invalido por ausencia de dominio", async ({ page }) => {
    await page.fill("#email-input", "e2eemail.com");
    await page.click("#login-button");
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveJSProperty(
      "validationMessage",
      "Please include an '@' in the email address. 'e2eemail.com' is missing an '@'.",
    );
  });

  test("deve alertar senha vazia ao tentar logar sem preencher o campo de senha", async ({
    page,
  }) => {
    await page.fill("#email-input", "e2e@email.com");
    await page.click("#login-button");
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveJSProperty(
      "validationMessage",
      "Please fill out this field.",
    );
  });

  test("deve alertar credenciais inválidas: email não cadastrado", async ({
    page,
  }) => {
    await page.fill("#email-input", "e2@email.com");
    await page.fill("#password-input", "1234");
    await page.click("#login-button");
    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Erro");
    await expect(modalContent).toHaveText(
      "Erro ao realizar login: Utilizador não encontrado.",
    );
    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await expect(modalButton).toBeEnabled();
    await expect(modalButton).toHaveText("OK");
  });

  test("deve alertar credenciais inválidas: senha incorreta", async ({
    page,
  }) => {
    await page.fill("#email-input", "e2e@email.com");
    await page.fill("#password-input", "1234");
    await page.click("#login-button");
    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Erro");
    await expect(modalContent).toHaveText(
      "Erro ao realizar login: Senha incorreta.",
    );
    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await expect(modalButton).toBeEnabled();
    await expect(modalButton).toHaveText("OK");
  });
});
