import { test } from "../src/fixtures/test";

test("test Incident creation @critical", async ({
  loginPage,
  incidentPage,
}) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "TEST_USERNAME and TEST_PASSWORD must be configured to run incident creation",
    );
  }

  const title = `Incidents: Plant layout ${Date.now()}`;
  const description = "Incidents: Plant layout Description";

  await loginPage.goto();
  await loginPage.login(username!, password!);
  await incidentPage.open();
  await incidentPage.startCreation();
  await incidentPage.fillBasicDetails(title, description);
  await incidentPage.selectSeverity();
  await incidentPage.selectLocation();
  await incidentPage.selectArea();
  await incidentPage.dismissNextSaveDialog();
  await incidentPage.save();
  await incidentPage.expectCreated(title);
});