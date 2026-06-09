import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { presetInputSchema, presetVariantInputSchema } from "./schema";

describe("Custom Preset Schemas", () => {
  describe("presetVariantInputSchema", () => {
    it("accepts valid variant inputs", () => {
      const input = {
        label: "Large Portrait",
        width: "1024",
        height: "1024",
        format: "png",
        filename: "{name}_large",
        optional: false,
      };
      expect(() => v.parse(presetVariantInputSchema, input)).not.toThrow();
    });

    it("rejects empty labels", () => {
      const input = {
        label: "   ",
        width: "100",
        height: "100",
        format: "png",
        filename: "test",
        optional: false,
      };
      expect(() => v.parse(presetVariantInputSchema, input)).toThrow("Label is required");
    });

    it("requires width and height to be positive numbers", () => {
      const input = {
        label: "Test",
        width: "0",
        height: "100",
        format: "png",
        filename: "test",
        optional: false,
      };
      expect(() => v.parse(presetVariantInputSchema, input)).toThrow("Must be at least 1");
    });
  });

  describe("presetInputSchema", () => {
    it("accepts valid preset inputs", () => {
      const input = {
        name: "My RPG",
        defaultName: "PORTRAIT",
        maxLength: "8",
        wrapInFolder: false,
        variants: [
          {
            label: "Main",
            width: "256",
            height: "256",
            format: "webp",
            filename: "main",
            optional: false,
          },
        ],
      };
      expect(() => v.parse(presetInputSchema, input)).not.toThrow();
    });

    it("rejects empty preset names", () => {
      const input = {
        name: "",
        defaultName: "",
        maxLength: "",
        wrapInFolder: false,
        variants: [
          {
            label: "Main",
            width: "256",
            height: "256",
            format: "webp",
            filename: "main",
            optional: false,
          },
        ],
      };
      expect(() => v.parse(presetInputSchema, input)).toThrow("Preset name is required");
    });

    it("handles empty maxLength safely", () => {
      const input = {
        name: "Test",
        defaultName: "",
        maxLength: "",
        wrapInFolder: false,
        variants: [
          {
            label: "Main",
            width: "256",
            height: "256",
            format: "webp",
            filename: "main",
            optional: false,
          },
        ],
      };
      const parsed = v.parse(presetInputSchema, input);
      expect(parsed.maxLength).toBeUndefined();
    });
  });
});
