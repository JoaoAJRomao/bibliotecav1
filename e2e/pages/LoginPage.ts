import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  
  // Registration fields
  readonly nameInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerSubmitButton: Locator;
  readonly backToLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("#email-input");
    this.passwordInput = page.locator("#password-input");
    this.loginButton = page.locator("#login-button");
    this.registerLink = page.getByRole("button", { name: "Cadastre-se agora" });

    // Registration
    this.nameInput = page.getByPlaceholder("Nome Completo");
    this.confirmPasswordInput = page.getByPlaceholder("Confirmar Senha");
    this.registerSubmitButton = page.getByRole("button", { name: "Cadastrar" });
    this.backToLoginButton = page.getByRole("button", { name: "Voltar" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToRegister() {
    await this.registerLink.click();
  }

  async register(name: string, email: string, pass: string, confirmPass: string) {
    await this.nameInput.fill(name);
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha", { exact: true }).fill(pass);
    await this.confirmPasswordInput.fill(confirmPass);
    await this.registerSubmitButton.click();
  }
}
