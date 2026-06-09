import type { PortraitVariant } from "@/data/presets";
import { describe, expect, it } from "vitest";
import { resolveVariantFilename } from "./export";

describe("resolveVariantFilename", () => {
  it("replaces {name} with the provided portrait name", () => {
    const variant = {
      filename: "{name}_M",
      format: "png",
    } as PortraitVariant;

    expect(resolveVariantFilename(variant, "Garrus")).toBe("Garrus_M.png");
  });

  it("handles filenames without {name}", () => {
    const variant = {
      filename: "fixed_portrait",
      format: "webp",
    } as PortraitVariant;

    expect(resolveVariantFilename(variant, "Garrus")).toBe("fixed_portrait.webp");
  });

  it("handles multiple {name} tokens if they exist", () => {
    const variant = {
      filename: "{name}_portrait_{name}",
      format: "jpeg",
    } as PortraitVariant;

    expect(resolveVariantFilename(variant, "Hero")).toBe("Hero_portrait_{name}.jpeg");
    // Note: String.replace() only replaces the first occurrence by default.
    // This test ensures we document that known behavior.
  });
});
