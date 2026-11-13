import { test, expect } from "../src/fixtures/test";

test.describe("Login entry point", () => {
  test("redirects to the login page and renders the login application @smoke", async ({
    loginPage,
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await loginPage.goto();
    await expect(loginPage.loginRoot).toBeVisible({ timeout: 15_000 });

    expect(pageErrors).toEqual([]);
  });

  test("unauthenticated protected navigation is redirected to login @smoke @auth", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  });
});
