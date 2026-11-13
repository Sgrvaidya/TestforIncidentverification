import { test, expect } from "../src/fixtures/test";

test.describe("Authenticated flows", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("can log in with valid environment credentials @auth @critical", async ({
    loginPage,
    page,
  }) => {
    test.skip(
      !process.env.TEST_USERNAME || !process.env.TEST_PASSWORD,
      "Set TEST_USERNAME and TEST_PASSWORD to run authenticated tests",
    );

    await loginPage.login(
      process.env.TEST_USERNAME!,
      process.env.TEST_PASSWORD!,
    );

    await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/, { timeout: 30_000 });
  });

  test("rejects an empty username and password @auth", async ({ loginPage }) => {
    await expect(loginPage.username).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.password).toBeVisible({ timeout: 15_000 });
    await loginPage.submit.click();

    await expect(loginPage.page).toHaveURL(/\/login(?:[/?#]|$)/);
  });
});
