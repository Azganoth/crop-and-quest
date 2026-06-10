import { expect, type Locator, type Page } from "@playwright/test";

export class ReviewWorkspacePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly downloadAllBtn: Locator;
  readonly previewImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /Review.*Portraits/i });
    this.downloadAllBtn = page.getByRole("button", { name: "Download All" });
    this.previewImages = page.locator('img[src^="blob:"]');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 15000 });
    await expect(this.previewImages.first()).toBeVisible({ timeout: 15000 });
  }

  async downloadAll(): Promise<string> {
    await expect(this.downloadAllBtn).toBeVisible();
    await expect(this.downloadAllBtn).toBeEnabled();

    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadAllBtn.click();
    const download = await downloadPromise;

    return download.suggestedFilename();
  }
}
