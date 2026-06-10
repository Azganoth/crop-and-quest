import { test } from "@playwright/test";
import { CropperWorkspacePage } from "../pages/CropperWorkspacePage";
import { HomePage } from "../pages/HomePage";
import { SelectWorkspacePage } from "../pages/SelectWorkspacePage";

test.describe("Cropper Interactivity", () => {
  test("should allow interacting with zoom controls", async ({ page }) => {
    const home = new HomePage(page);
    const select = new SelectWorkspacePage(page);
    const cropper = new CropperWorkspacePage(page);

    await test.step("Navigate and upload image", async () => {
      await home.goto();
      await home.selectPreset("Baldur's Gate I");
      await select.uploadTestImage();
    });

    await test.step("Verify initial zoom state", async () => {
      await cropper.expectZoomVisible();
      await cropper.expectZoomValue("100");
    });

    await test.step("Interact with zoom control", async () => {
      await cropper.setZoom("150");
      await cropper.expectZoomValue("150");
    });

    await test.step("Reset zoom", async () => {
      await cropper.resetZoom();
      await cropper.expectZoomValue("100");
    });
  });
});
