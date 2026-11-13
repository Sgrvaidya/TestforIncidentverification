import { test } from "../src/fixtures/test";

test("test Near miss Creation", async ({ loginPage, incidentPage }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "TEST_USERNAME and TEST_PASSWORD must be configured to run Near Miss incident creation",
    );
  }

  await loginPage.goto();
  await loginPage.login(username!, password!);
  await incidentPage.open();
  await incidentPage.startCreation();
  await incidentPage.fillNearMissDetails(
    "incident: near miss -01",
    "incident :near miss description",
    "incident: near miss action",
  );
  await incidentPage.selectNearMissDateAndTime();
  await incidentPage.selectNearMissLocation();
  await incidentPage.selectNearMissArea();
  await incidentPage.submitAndExpectScriptError();
});