import { Page, Locator } from "@playwright/test";

export class MainPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly logoutButton: Locator;
  readonly activeLoansSection: Locator;
  readonly addBookButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Buscar por nome do livro...");
    // Logout button is in Navbar
    this.logoutButton = page.getByRole("button", { name: "Sair" });
    this.activeLoansSection = page.locator("section").filter({ hasText: "Meus Empréstimos Ativos" });
    this.addBookButton = page.getByRole("button", { name: "Adicionar novo livro" });
  }

  async logout() {
    await this.logoutButton.click();
  }

  async searchBook(title: string) {
    await this.searchInput.fill(title);
  }

  getBookCard(title: string): Locator {
    // We target the BookCard which contains the specific book title
    return this.page.locator(".bg-white, .bg-neutral-900").filter({ hasText: title }).first();
  }

  async borrowBook(title: string) {
    const card = this.getBookCard(title);
    await card.getByRole("button", { name: "Solicitar Empréstimo" }).click();
  }

  async returnBookFromCard(title: string) {
    const card = this.getBookCard(title);
    await card.getByRole("button", { name: "Devolver Livro" }).click();
  }

  async returnBookFromLoansList(title: string) {
    const loanItem = this.page.locator("div").filter({ hasText: title }).filter({ has: this.page.getByRole("button", { name: "Devolver", exact: true }) }).first();
    await loanItem.getByRole("button", { name: "Devolver", exact: true }).click();
  }

  // Admin Actions
  async openAddBookModal() {
    await this.addBookButton.click();
  }

  async fillBookForm(title: string, author: string, year: string, publisher: string, quantity: string) {
    await this.page.getByPlaceholder("Ex: Dom Casmurro").fill(title);
    await this.page.getByPlaceholder("Ex: Machado de Assis").fill(author);
    await this.page.getByPlaceholder("Ex: 1899").fill(year);
    await this.page.getByPlaceholder("Ex: Livraria Garnier").fill(publisher);
    await this.page.getByPlaceholder("Ex: 5").fill(quantity);
  }

  async saveBook() {
    await this.page.getByRole("button", { name: /Adicionar ao Acervo|Salvar Alterações/ }).click();
  }

  async openEditBookModal(title: string) {
    const card = this.getBookCard(title);
    await card.getByRole("button", { name: "Editar Livro" }).click();
  }

  async deleteBook(title: string) {
    const card = this.getBookCard(title);
    await card.getByRole("button", { name: "Remover Livro" }).click();
    // Confirm via sweetalert2 modal
    await this.page.locator(".swal2-confirm").click();
  }
}
