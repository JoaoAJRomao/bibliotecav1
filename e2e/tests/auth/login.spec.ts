import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { resetDatabase } from "../../utils/helpers";

test.describe("Autenticação e Cadastro (Cenários de Sucesso e Falha)", () => {
  test.describe.configure({ mode: "serial" });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Garante isolamento completo do estado do banco
    await resetDatabase();
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("deve realizar login com sucesso usando credenciais válidas", async ({ page }) => {
    await loginPage.login("user@email.com", "123");
    await expect(page).toHaveURL(/.*\/livros/);
  });

  test("deve exibir validação nativa de email vazio ao tentar logar sem preencher", async ({ page }) => {
    await loginPage.login("", "");
    const emailInput = loginPage.emailInput;
    await expect(emailInput).toHaveJSProperty("validationMessage", "Please fill out this field.");
  });

  test("deve exibir validação nativa de email inválido por ausência de domínio", async ({ page }) => {
    await loginPage.emailInput.fill("e2eemail.com");
    await loginPage.loginButton.click();
    const emailInput = loginPage.emailInput;
    await expect(emailInput).toHaveJSProperty(
      "validationMessage",
      "Please include an '@' in the email address. 'e2eemail.com' is missing an '@'."
    );
  });

  test("deve exibir validação nativa de senha vazia", async ({ page }) => {
    await loginPage.emailInput.fill("user@email.com");
    await loginPage.loginButton.click();
    const passwordInput = loginPage.passwordInput;
    await expect(passwordInput).toHaveJSProperty("validationMessage", "Please fill out this field.");
  });

  test("deve alertar erro ao tentar logar com e-mail não cadastrado", async ({ page }) => {
    await loginPage.login("naoexiste@email.com", "123");

    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Erro");
    await expect(modalContent).toHaveText("Erro ao realizar login: Utilizador não encontrado.");

    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await modalButton.click();
  });

  test("deve alertar erro ao tentar logar com senha incorreta", async ({ page }) => {
    await loginPage.login("user@email.com", "senha_errada");

    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Erro");
    await expect(modalContent).toHaveText("Erro ao realizar login: Senha incorreta.");

    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await modalButton.click();
  });

  test("deve alertar erro ao tentar cadastrar com senhas não coincidentes", async ({ page }) => {
    await loginPage.navigateToRegister();
    await expect(page).toHaveURL(/.*\/cadastro/);

    await loginPage.register("Novo Usuario", "novo@email.com", "123", "321");

    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Senhas diferentes");
    await expect(modalContent).toHaveText("As senhas inseridas não coincidem.");

    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await modalButton.click();
  });

  test("deve alertar erro ao tentar cadastrar e-mail já cadastrado", async ({ page }) => {
    await loginPage.navigateToRegister();
    await expect(page).toHaveURL(/.*\/cadastro/);

    // email 'user@email.com' já foi semeado no resetDatabase
    await loginPage.register("Outro Nome", "user@email.com", "123", "123");

    const modalTitle = page.locator("#swal2-title");
    const modalContent = page.locator("#swal2-html-container");
    await expect(modalTitle).toHaveText("Erro no cadastro");
    await expect(modalContent).toHaveText("Este e-mail já está cadastrado.");

    const modalButton = page.locator(".swal2-confirm");
    await expect(modalButton).toBeVisible();
    await modalButton.click();
  });

  test("deve redirecionar para a tela de login ao tentar acessar /livros sem autenticação", async ({ page }) => {
    await page.goto("/livros");
    // O useEffect redireciona de volta para / e depois para /login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
