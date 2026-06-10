import { expect, test } from "@playwright/test";
import { CustomPresetPage } from "../pages/CustomPresetPage";
import { HomePage } from "../pages/HomePage";

test.describe("Custom Presets Flow", () => {
  test("should create, use, and delete a custom preset", async ({ page }) => {
    const home = new HomePage(page);
    const customForm = new CustomPresetPage(page);

    const presetName = "My Custom RPG";

    await test.step("Create custom preset", async () => {
      await home.goto();
      await home.clickCustomPreset();
      await customForm.fillForm({
        name: presetName,
        label: "Portrait",
        width: "200",
        height: "300",
      });
      await customForm.saveAndContinue();
    });

    await test.step("Verify preset appears on home page", async () => {
      await home.goto();
      const presetCard = await home.getPresetCard(presetName);
      await expect(presetCard).toBeVisible({ timeout: 10000 });
    });

    await test.step("Delete custom preset", async () => {
      await home.deleteCustomPreset(presetName);
      const presetCard = await home.getPresetCard(presetName);
      await expect(presetCard).toBeHidden({ timeout: 10000 });
    });
  });
});
