import { Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageReady(timeout = 15_000): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
