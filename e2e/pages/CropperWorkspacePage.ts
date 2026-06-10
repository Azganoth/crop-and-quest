import { expect, type Locator, type Page } from "@playwright/test";

export class CropperWorkspacePage {
  readonly page: Page;
  readonly saveBtn: Locator;
  readonly zoomFieldset: Locator;
  readonly zoomInput: Locator;
  readonly resetZoomBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveBtn = page.getByRole("button", { name: /^Save/ });
    this.zoomFieldset = page.locator('fieldset:has(legend:has-text("Zoom"))');
    this.zoomInput = this.zoomFieldset.locator('input[type="number"]');
    this.resetZoomBtn = this.zoomFieldset.locator('button:has-text("Reset")');
  }

  async clickSaveAndNext() {
    await expect(this.saveBtn).toBeVisible();
    await this.saveBtn.click();
  }

  async clickSave() {
    await expect(this.saveBtn).toBeVisible();
    await this.saveBtn.click();
  }

  async expectZoomVisible() {
    await expect(this.zoomInput).toBeVisible({ timeout: 10000 });
  }

  async expectZoomValue(value: string) {
    await expect(this.zoomInput).toHaveValue(value);
  }

  async setZoom(value: string) {
    await this.zoomInput.fill(value);
    await this.zoomInput.blur();
  }

  async resetZoom() {
    await this.resetZoomBtn.click();
  }
}
