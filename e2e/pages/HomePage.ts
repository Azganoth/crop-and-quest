import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly customPresetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /RPG Portrait App/i });
    this.customPresetLink = page.getByRole("link", { name: "Custom Preset" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectPreset(name: string) {
    await this.page.getByText(name, { exact: true }).click();
  }

  async clickCustomPreset() {
    await this.customPresetLink.click();
  }

  async getPresetCard(name: string): Promise<Locator> {
    return this.page.locator("h4", { hasText: name });
  }

  async deleteCustomPreset(name: string) {
    const deleteButton = this.page.getByRole("button", { name: `Delete ${name}` });
    await deleteButton.click();

    const confirmButton = this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete" });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }
}
