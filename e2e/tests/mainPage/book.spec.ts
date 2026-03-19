import { test, expect } from "@playwright/test";

test.describe("Navegação e Livros", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.fill("#email-input", "e2e@email.com");
    await page.fill("#password-input", "123");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*\/livros/);
  });

  test("deve impedir acesso a /livros se o usuário deslogar", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.reload();
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
