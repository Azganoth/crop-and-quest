import { expect, test } from "@playwright/test";
import { CropperWorkspacePage } from "../pages/CropperWorkspacePage";
import { HomePage } from "../pages/HomePage";
import { ReviewWorkspacePage } from "../pages/ReviewWorkspacePage";
import { SelectWorkspacePage } from "../pages/SelectWorkspacePage";

test.describe("Portrait Generation Flow", () => {
  test("should generate and download a ZIP file for Baldur's Gate", async ({ page }) => {
    const home = new HomePage(page);
    const select = new SelectWorkspacePage(page);
    const cropper = new CropperWorkspacePage(page);
    const review = new ReviewWorkspacePage(page);

    await test.step("Navigate and select preset", async () => {
      await home.goto();
      await home.selectPreset("Baldur's Gate I");
    });

    await test.step("Upload image", async () => {
      await select.uploadTestImage();
    });

    await test.step("Crop variants", async () => {
      // Variant 1: Large
      await cropper.clickSaveAndNext();
      // Variant 2: Medium
      await cropper.clickSaveAndNext();
      // Variant 3: Small
      await cropper.clickSave();
    });

    await test.step("Review and download", async () => {
      await review.expectLoaded();
      const filename = await review.downloadAll();
      expect(filename).toBe("baldurs-gate-1-portraits.zip");
    });
  });
});
