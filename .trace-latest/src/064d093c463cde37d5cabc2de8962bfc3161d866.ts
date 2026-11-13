import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { IncidentPage } from "../pages/IncidentPage";

type Fixtures = {
  loginPage: LoginPage;
  incidentPage: IncidentPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  incidentPage: async ({ page }, use) => {
    await use(new IncidentPage(page));
  },
});

export { expect } from "@playwright/test";
