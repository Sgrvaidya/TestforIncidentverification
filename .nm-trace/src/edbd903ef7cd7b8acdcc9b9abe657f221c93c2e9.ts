import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class IncidentPage extends BasePage {
  readonly incidentReportsLink: Locator;
  readonly createButton: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categoryInput: Locator;
  readonly nearMissOption: Locator;
  readonly actionInput: Locator;
  readonly datePickerButton: Locator;
  readonly dateOption: Locator;
  readonly hourPickerButton: Locator;
  readonly hourOption: Locator;
  readonly locationPickerButton: Locator;
  readonly locationConfirm: Locator;
  readonly areaPickerButton: Locator;
  readonly areaConfirm: Locator;
  readonly commitOpenButton: Locator;
  readonly scriptErrorMessage: Locator;
  readonly severityPickerButton: Locator;
  readonly severityOption: Locator;
  readonly customField: Locator;
  readonly locationInput: Locator;
  readonly locationCheckbox: Locator;
  readonly areaInput: Locator;
  readonly areaCheckbox: Locator;
  readonly saveButton: Locator;
  readonly incidentText: Locator;
  readonly recentlyCreated: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.incidentReportsLink = page
      .locator('a[data-ft-type="shortcut"]')
      .filter({ hasText: /incident reports/i })
      .first();
    this.createButton = page.locator("#cni");
    this.titleInput = page.locator("#anonymous_element_24");
    this.descriptionInput = page.locator("#cni_CNI_CF291 textarea");
    this.categoryInput = page.locator("#cni_CNI_CF281");
    this.nearMissOption = page.getByText("Near miss", { exact: true });
    this.actionInput = page.locator("#cni_CNI_CF292 textarea");
    this.datePickerButton = page.locator("#cni_CNI_CF217");
    this.dateOption = page.locator(".datepicker td.today");
    this.hourPickerButton = page.locator("#cni_CNI_CF290");
    this.hourOption = page.locator("#anonymous_element_71");
    this.locationPickerButton = page.locator("#cni_CNI_CF223 a.addcontent.fixed");
    this.areaPickerButton = page.locator(
      '[data-ft-field-label*="Area"], [data-label*="Area"]',
    );
    this.commitOpenButton = page.locator("#cni_commitopen");
    this.scriptErrorMessage = page.getByText("Script error occurred in", {
      exact: false,
    });
    this.severityPickerButton = page
      .locator(".newpicker.small > .newpickerbutton");
    this.severityOption = page.getByText("2", { exact: true });
    this.customField = page.locator("#cni_CNI_CF223 a.addcontent.fixed");
    this.locationInput = page.locator("#cni_CNI_CF223");
    this.locationCheckbox = page
      .locator(".overlay-wrapper.shown")
      .last()
      .locator('input[type="checkbox"]:visible')
      .first();
    this.locationConfirm = page
      .locator(".overlay-wrapper.shown")
      .last()
      .getByText("Confirm selection", { exact: true });
    this.areaInput = page.locator(
      '[data-ft-field-label*="Area"], [data-label*="Area"]',
    );
    this.areaCheckbox = page
      .locator(".overlay-wrapper.shown")
      .last()
      .locator('input[type="checkbox"]:visible')
      .first();
    this.areaConfirm = page
      .locator(".overlay-wrapper.shown")
      .last()
      .getByText("Confirm selection", { exact: true });
    this.saveButton = page.locator("#cni_commit");
    this.incidentText = page.getByText("Incident", { exact: true });
    this.recentlyCreated = page.locator("#recentlycreated");
    this.cancelButton = page.getByText("cancel", { exact: true });
  }

  async open(): Promise<void> {
    await expect(this.incidentReportsLink).toBeVisible({ timeout: 60_000 });
    await this.incidentReportsLink.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(10_000);
  }

  async startCreation(): Promise<void> {
    const visibleCreateButton = this.page.locator("#cni:visible").first();
    await expect(visibleCreateButton).toBeVisible({ timeout: 60_000 });
    await this.page.waitForTimeout(10_000);
    await visibleCreateButton.click({ force: true, timeout: 60_000 });
    await this.page.waitForTimeout(5_000);
  }

  async fillBasicDetails(
    title: string,
    description: string,
  ): Promise<void> {
    await this.titleInput.waitFor({ state: "visible", timeout: 60_000 });
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.categoryInput.click();
  }

  async fillNearMissDetails(
    title: string,
    description: string,
    action: string,
  ): Promise<void> {
    await this.titleInput.waitFor({ state: "visible", timeout: 60_000 });
    await this.titleInput.fill("");
    await this.titleInput.fill(title);
    await this.nearMissOption.click();
    await this.descriptionInput.fill(description);
    await this.actionInput.fill(action);
  }

  async selectNearMissDateAndTime(): Promise<void> {
    await this.datePickerButton.click();
    await this.dateOption.click();
    await this.hourPickerButton.click();
    await this.hourOption.fill("09:00");
  }

  async selectNearMissLocation(): Promise<void> {
    await this.locationPickerButton.click({ force: true });
    if ((await this.locationCheckbox.count()) === 0) return;
    await this.locationCheckbox.check();
    await this.locationConfirm.click();
  }

  async selectNearMissArea(): Promise<void> {
    if ((await this.areaPickerButton.count()) === 0) return;
    await this.areaPickerButton.click();
    await this.areaCheckbox.check();
    await this.areaConfirm.click();
  }

  async submitAndExpectScriptError(): Promise<void> {
    await this.commitOpenButton.click();
    await expect(this.scriptErrorMessage).toBeVisible();
  }

  async selectSeverity(): Promise<void> {
    await this.severityPickerButton.click();
    await this.severityOption.click();
  }

  async selectLocation(): Promise<void> {
    await this.customField.click();
    await this.locationCheckbox.check();
    await this.locationConfirm.click();
  }

  async selectArea(): Promise<void> {
    if ((await this.areaInput.count()) === 0) return;
    await this.areaInput.click();
    await this.areaCheckbox.check();
    await this.areaConfirm.click();
  }

  async dismissNextSaveDialog(): Promise<void> {
    this.page.once("dialog", async (dialog) => {
      await dialog.dismiss();
    });
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async updateIncidentCategory(category: string): Promise<void> {
    const categoryOption = this.page
      .locator("#overlay1_overlaywrapper")
      .getByText(category, { exact: true });
    await expect(categoryOption).toBeVisible({ timeout: 60_000 });
    await categoryOption.click();
  }

  async expectCreated(title: string): Promise<void> {
    await this.cancelButton.click();
    await expect(
      this.page.getByRole("link", { name: title }),
    ).toBeVisible();
  }
}
