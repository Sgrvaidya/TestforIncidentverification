# Test Automation Plan for TenForce QA

## Playwright Framework Setup

The Page Object Model implementation is under `src/pages`:

- `src/pages/base/BasePage.ts` contains shared page behavior.
- `src/pages/LoginPage.ts` contains login-page actions and locators.
- `src/fixtures/test.ts` exposes page objects through Playwright fixtures.
- `tests/` contains feature-level spec files.

### Run locally

```powershell
npm install
npx playwright install
Copy-Item .env.example .env
npm run test:smoke
```

Set `TEST_USERNAME` and `TEST_PASSWORD` in `.env` only when running authentication coverage. Never commit `.env`.

## Application Under Test

- **URL:** https://qa-test.tenforce.info/
- **Entry point:** Redirects to `/login`
- **Application type:** Web application with server-rendered HTML and a JavaScript login interface
- **Primary automation approach:** Browser-based end-to-end testing

## Test Automation Objectives

- Validate the most important user journeys for every release.
- Detect login, navigation, authorization, data, and UI regressions early.
- Provide fast feedback without requiring fragile or duplicate manual checks.
- Run consistently on local machines and in CI.
- Produce clear failure evidence using screenshots, traces, videos, and logs.

## Proposed Tech Stack

- **Language:** TypeScript
- **UI test framework:** Playwright Test
- **Browser coverage:** Chromium, Firefox, and WebKit
- **Assertions:** Playwright `expect`
- **Test reporting:** Playwright HTML report plus JUnit XML for CI
- **Linting and formatting:** ESLint and Prettier
- **CI:** GitHub Actions or the organization-standard CI platform
- **Secrets:** CI secret store; never commit credentials

## Test Layers

### 1. Smoke Tests

Run on every deployment and pull request.

- Application loads successfully.
- The unauthenticated user is redirected to `/login`.
- Login page renders without JavaScript errors.
- Valid credentials can sign in.
- Authenticated landing page loads.
- A valid user can sign out.

### 2. Login and Authentication

- Successful login with valid credentials.
- Login with an incorrect username.
- Login with an incorrect password.
- Login with an empty username.
- Login with an empty password.
- Login with both fields empty.
- Password masking is applied.
- Password value is not exposed in the DOM or URL.
- Session remains active after a supported page refresh.
- Protected pages redirect an unauthenticated user to login.
- Logout invalidates the authenticated session.
- Direct use of an old session or browser back button does not grant access.
- Multiple failed login attempts are handled according to the application's policy.
- SAML login behavior, if enabled for the test environment, is verified separately.

Authentication tests must use environment-specific accounts. Test credentials must be supplied through environment variables such as `TEST_USERNAME` and `TEST_PASSWORD`.

### 3. Core Navigation

Document and automate the application's primary navigation after exploring the authenticated product. Typical coverage should include:

- Main menu and sub-menu navigation.
- Breadcrumb behavior.
- Browser back, forward, and refresh behavior.
- Opening pages in a new context where supported.
- Role-based visibility of navigation items.
- Authorization failures for inaccessible URLs.

### 4. Business Workflows

Automate the critical workflows discovered from product requirements, with realistic test data and cleanup. Candidate workflows include:

- Create, edit, validate, search, filter, export, and delete a business record.
- Attach or upload a supported file.
- Reject an unsupported or invalid file.
- Submit required fields and verify validation messages.
- Save a draft and resume it if the feature exists.
- Approve, reject, or assign an item if the application provides those actions.
- Verify that audit or activity information updates after a change.
- Verify role or permission restrictions on important actions.

Do not automate a workflow until its stable end-to-end path is confirmed manually.

### 5. UI and Data Validation

- Required fields and field-length limits.
- Invalid formats such as email, date, number, and special characters.
- Positive and negative numeric boundaries.
- Empty, long, duplicate, and whitespace-only inputs.
- Sorting and filtering with known data.
- Pagination and empty result states.
- Confirmation dialogs before destructive actions.
- Successful operation and error messages.
- No stale data after create, update, or delete operations.

### 6. API-Assisted Test Setup

Use the application's APIs, when safe and available, to create prerequisite records faster. Browser automation should remain responsible for validating the user experience.

- Prefer API setup for records that do not need to be created through UI.
- Use UI automation for workflows whose behavior is being tested.
- Clean up created test data.
- Keep API contracts separate from UI page objects.
- Detect and report API response, authorization, and timeout failures.

## Repository Structure

```text
tests/
  fixtures/       # Authentication and shared setup
  pages/          # Page objects and reusable UI components
  flows/          # Multi-page business workflows
  api/            # API clients and data helpers
  utils/          # Waits, assertions, file, date, and logging helpers
  smoke.spec.ts
  authentication.spec.ts
  navigation.spec.ts
  workflow.spec.ts
playwright.config.ts
.env.example
.github/workflows/
README.md
```

## Locator Strategy

Use stable locators in this priority order:

1. Accessibility roles and names.
2. A developer-approved `data-testid`.
3. Stable labels associated with form controls.
4. A constrained semantic or CSS selector.

Avoid selectors based only on:

- Generated React or framework class names.
- Deep DOM positions.
- Translated text when the test is not validating localization.
- Static indexes that change when data is inserted.

Each page object should expose user-level actions such as `login()`, `openDashboard()`, or `createRecord()`, rather than exposing raw selectors outside the page object.

## Test Design Rules

- Keep tests independent; no test should rely on another test's success.
- Use isolated browser contexts for every test.
- Create unique data using timestamps or generated IDs.
- Wait for application conditions instead of using fixed sleeps.
- Capture meaningful failure evidence.
- Avoid asserting implementation details that users cannot observe.
- Use tags such as `@smoke`, `@auth`, and `@critical` for test selection.
- Limit retries in normal runs and require investigation for repeated retry passes.
- Mark external-service or environment-dependent coverage separately from core tests.

## Parallelism and Reliability

- Run independent tests in parallel by default.
- Do not share mutable records between tests unless concurrency is explicitly controlled.
- Use workers appropriate for the test environment and application capacity.
- Disable parallelism for tests that modify shared configuration.
- Add timeouts based on application behavior rather than global excessive delays.
- Trace failures and repeat failures locally before changing application or test code.
- Quarantine repeatedly unstable tests only after documenting the root cause and owner.

## Reporting and Evidence

Each failure should provide:

- Test name and tags.
- Browser and viewport.
- Error message and exact failed action.
- Screenshot.
- Playwright trace.
- Console and network errors where available.
- Record or account identifiers used by the test.

Recommended artifacts:

- HTML report for interactive investigation.
- JUnit XML for CI.
- Screenshots and videos for failed tests.
- Trace files for failure debugging.
- Daily or release trend summary in the CI dashboard.

## CI Execution Plan

### Pull Request

- Install dependencies and browsers.
- Run formatting and lint checks.
- Run smoke and critical authentication tests.
- Fail the pull request on critical failure.

### Deployment

1. Verify environment configuration and availability.
2. Run smoke tests against the deployed URL.
3. Run the critical regression suite.
4. Publish reports and artifacts.
5. Roll back, block promotion, or notify the responsible team when critical tests fail.

### Scheduled

- Run full desktop browser coverage nightly.
- Run mobile or responsive browser projects on the agreed schedule.
- Run expanded negative and data-validation coverage.
- Review flaky tests and application errors.

### Release

- Run the complete regression suite before promotion.
- Run final smoke tests after promotion.
- Record the tested build, commit, browser versions, and environment.

## Responsive and Accessibility Coverage

- Test common desktop sizes such as 1366x768 and 1920x1080.
- Test representative tablet and mobile viewports.
- Verify that menus, forms, dialogs, and tables remain usable after reflow.
- Check keyboard navigation for the login page and primary workflows.
- Check visible focus, logical tab order, and dialog behavior.
- Run automated accessibility scans with axe where practical.
- Document manual accessibility checks for content, screen-reader behavior, and keyboard-only flows.

## Security and Privacy Checks

- Never store real credentials, personal information, or secrets in source control.
- Use dedicated test accounts and test-only tenant data.
- Verify that sensitive fields are masked appropriately.
- Confirm protected pages cannot be reached anonymously.
- Confirm role-restricted actions cannot be called directly.
- Redact passwords and sensitive values in reports, logs, and traces.
- Do not capture production-like data in test artifacts.

## Environments and Configuration

Configuration should be environment-driven:

```env
BASE_URL=https://qa-test.tenforce.info
TEST_USERNAME=
TEST_PASSWORD=
```

Example Playwright configuration settings:

- Base URL from environment variables.
- Desktop Chromium project as the default fast project.
- Separate Firefox and WebKit projects.
- Mobile projects only where the application is designed for them.
- Retries disabled or kept minimal for locally diagnosed tests.
- Trace capture on the first retry.
- Screenshot capture on failure.
- Video retention on failure.

## Maintenance Strategy

- Review and update automation alongside acceptance criteria.
- Keep locators centralized in page objects.
- Add smoke coverage before adding low-level volume coverage.
- Refactor tests when application behavior changes, rather than weakening assertions.
- Assign an owner to each critical flow.
- Review flaky or skipped tests weekly.
- Remove duplicate tests and obsolete test data helpers.
- Keep Playwright and browser dependencies updated through controlled dependency upgrades.

## Risks and Assumptions

- Login credentials and test roles are not currently available, so authentication setup must be supplied by the test team.
- Business workflows and role permissions are not observable from the unauthenticated entry page and must be confirmed by product or QA stakeholders.
- The application may use session cookies, redirects, SAML, or APIs that require additional configuration.
- Dynamic IDs and third-party integrations may require explicit stabilizing selectors or integration test boundaries.
- Test accounts must be permitted to create, update, and delete only isolated test records.

## Initial Delivery Sequence

1. Create the Playwright project and environment configuration.
2. Implement reusable fixtures, login page objects, and browser helpers.
3. Add environment connectivity and unauthenticated login-page smoke tests.
4. Obtain approved test credentials and identify role restrictions.
5. Automate valid login, logout, session, and protected-route coverage.
6. Explore the authenticated product and map critical user workflows.
7. Automate the highest-risk workflows with API-assisted setup.
8. Add responsive, accessibility, reporting, and CI coverage.
9. Run the suite repeatedly to remove instability.
10. Baseline pass rates and expand regression coverage based on defect history.

## Entry Criteria

- The QA environment is stable and accessible.
- Test accounts with required roles are available.
- Critical workflows and expected business rules are documented.
- Required test data can be created and cleaned safely.
- Environment variables and test secrets can be configured in CI.

## Exit Criteria

- All critical smoke and authentication tests pass.
- No open high-severity defects remain in automated critical paths.
- Reported flaky tests are below the agreed threshold.
- Evidence is available for each release run.
- Test coverage is traceable to product requirements and known defects.