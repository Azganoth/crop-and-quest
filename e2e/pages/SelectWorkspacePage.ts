import { expect, type Locator, type Page } from "@playwright/test";
import path from "path";

export class SelectWorkspacePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly fileInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /Prepare a portrait/i });
    this.fileInput = page.locator("#file-upload");
  }

  async expectLoaded() {
    // In dev mode, Next.js might take >5s to compile the page on first visit
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async uploadTestImage() {
    await this.expectLoaded();
    const imagePath = path.resolve(__dirname, "..", "fixtures", "test-image.png");
    await this.fileInput.setInputFiles(imagePath);
  }
}
