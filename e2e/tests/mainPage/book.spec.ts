import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { MainPage } from "../../pages/MainPage";
import { resetDatabase } from "../../utils/helpers";

test.describe("Fluxos de Livros e Empréstimos (Sucesso e Falha)", () => {
  // Executa os testes sequencialmente para evitar conflitos no banco de dados
  test.describe.configure({ mode: "serial" });

  let loginPage: LoginPage;
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    loginPage = new LoginPage(page);
    mainPage = new MainPage(page);
  });

  test.describe("Fluxos do Leitor (Usuário Comum)", () => {
    test.beforeEach(async () => {
      await loginPage.goto();
      await loginPage.login("user@email.com", "123");
    });

    test("deve pesquisar livros por título", async () => {
      await mainPage.searchBook("1984");
      const bookCard1984 = mainPage.getBookCard("1984 (Exemplar Único)");
      const bookCardAnel = mainPage.getBookCard("O Senhor dos Anéis");

      await expect(bookCard1984).toBeVisible();
      await expect(bookCardAnel).not.toBeVisible();
    });

    test("deve emprestar e devolver um livro com sucesso", async ({ page }) => {
      const bookTitle = "O Senhor dos Anéis";

      // Solicita empréstimo
      await mainPage.borrowBook(bookTitle);

      // Aguarda o alerta Swal de sucesso e fecha
      const modalTitle = page.locator("#swal2-title");
      await expect(modalTitle).toHaveText("Empréstimo Confirmado!");
      await page.waitForTimeout(2200); // Aguarda o sumiço do modal temporizado

      // Verifica se o livro consta nos Meus Empréstimos Ativos
      const loanList = mainPage.activeLoansSection;
      await expect(loanList).toBeVisible();
      await expect(loanList.getByText(bookTitle)).toBeVisible();

      // Devolve o livro pela lista de empréstimos
      await mainPage.returnBookFromLoansList(bookTitle);

      // Aguarda alerta de devolução e confirmação
      await expect(modalTitle).toHaveText("Devolução Confirmada!");
      await page.waitForTimeout(2200);

      // Verifica se sumiu da lista de empréstimos ativos
      await expect(loanList.getByText(bookTitle)).not.toBeVisible();
    });

    test("Cenário de Falha: deve exibir botão desabilitado para livro sem estoque", async () => {
      const outOfStockBook = "Livro Indisponível (Sem Estoque)";
      const card = mainPage.getBookCard(outOfStockBook);

      await expect(card).toBeVisible();
      await expect(card.getByText("Esgotado")).toBeVisible();
      
      const borrowButton = card.getByRole("button", { name: "Não Disponível" });
      await expect(borrowButton).toBeVisible();
      await expect(borrowButton).toBeDisabled();
    });
  });

  test.describe("Fluxos do Administrador", () => {
    test.beforeEach(async () => {
      await loginPage.goto();
      await loginPage.login("admin@email.com", "123");
    });

    test("deve cadastrar, editar e excluir um livro com sucesso", async ({ page }) => {
      const bookTitle = "E2E Book Test";
      const bookAuthor = "QA Automator";
      const bookYear = "2026";
      const bookPublisher = "E2E Publishing";
      const bookQty = "3";

      // 1. Cadastrar livro
      await mainPage.openAddBookModal();
      await mainPage.fillBookForm(bookTitle, bookAuthor, bookYear, bookPublisher, bookQty);
      await mainPage.saveBook();

      // Aguarda modal Swal de sucesso
      const successModal = page.locator("#swal2-title");
      await expect(successModal).toHaveText("Salvo!");
      await page.waitForTimeout(2200);

      // Verifica se o livro aparece na listagem
      let card = mainPage.getBookCard(bookTitle);
      await expect(card).toBeVisible();
      await expect(card.getByText(bookAuthor)).toBeVisible();
      await expect(card.getByText(`Disponível (3 de 3)`)).toBeVisible();

      // 2. Editar livro
      await mainPage.openEditBookModal(bookTitle);
      // Mudar quantidade e título
      await page.getByPlaceholder("Ex: Dom Casmurro").fill(bookTitle + " Edição Especial");
      await page.getByPlaceholder("Ex: 5").fill("10");
      await mainPage.saveBook();

      await expect(successModal).toHaveText("Atualizado!");
      await page.waitForTimeout(2200);

      // Verifica alteração na listagem
      card = mainPage.getBookCard(bookTitle + " Edição Especial");
      await expect(card).toBeVisible();
      await expect(card.getByText(`Disponível (10 de 10)`)).toBeVisible();

      // 3. Excluir livro
      await mainPage.deleteBook(bookTitle + " Edição Especial");

      // Confirmar exclusão no SweetAlert
      const deleteModal = page.locator("#swal2-title");
      await expect(deleteModal).toHaveText("Excluído!");
      await page.locator(".swal2-confirm").click();

      // Verificar que foi removido
      await expect(card).not.toBeVisible();
    });

    test("Cenário de Falha: deve validar erros ao tentar cadastrar livro com dados inválidos", async ({ page }) => {
      // 1. Abre o modal
      await mainPage.openAddBookModal();
      
      // 2. Tenta preencher dados com estoque menor do que o mínimo nativo (min="1" no HTML5)
      await mainPage.fillBookForm("Livro Invalido", "Autor Teste", "2026", "Editora Teste", "0");
      await mainPage.saveBook();

      // O HTML5 nativo previne a submissão
      const qtyInput = page.getByPlaceholder("Ex: 5");
      await expect(qtyInput).toHaveJSProperty("validationMessage", "Value must be greater than or equal to 1.");
    });
  });
});
