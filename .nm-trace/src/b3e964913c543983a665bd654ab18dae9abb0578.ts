import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class LoginPage extends BasePage {
  readonly loginRoot: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.loginRoot = page.locator("#newui-login");
    this.username = page.getByRole("textbox", { name: /user|login|email/i }).first();
    this.password = page.locator('input[type="password"]').first();
    this.submit = page.getByRole("button", { name: /log in|sign in|login/i }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(this.page).toHaveURL(/\/login(?:[/?#]|$)/);
    await expect(this.loginRoot).toBeAttached();
  }

  async login(username: string, password: string): Promise<void> {
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
