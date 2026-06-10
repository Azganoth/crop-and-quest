import { type Locator, type Page } from "@playwright/test";

export class CustomPresetPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly labelInput: Locator;
  readonly widthInput: Locator;
  readonly heightInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel("Preset Name");
    this.labelInput = page.getByLabel("Label");
    this.widthInput = page.getByLabel("Width (px)");
    this.heightInput = page.getByLabel("Height (px)");
    this.saveButton = page.getByRole("button", { name: "Save and Continue" });
  }

  async fillForm(options: { name: string; label: string; width: string; height: string }) {
    await this.nameInput.fill(options.name);
    await this.labelInput.fill(options.label);
    await this.widthInput.fill(options.width);
    await this.heightInput.fill(options.height);
  }

  async saveAndContinue() {
    await this.saveButton.click();
    await this.page.waitForURL(/\/create\/custom-.*\/select/);
  }
}
