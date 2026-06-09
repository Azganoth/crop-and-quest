import { describe, expect, it } from "vitest";
import { ROUTES } from "./routes";

describe("ROUTES dictionary", () => {
  it("resolves static paths", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.create._base).toBe("/create");
    expect(ROUTES.custom._base).toBe("/custom");
    expect(ROUTES.custom.new).toBe("/custom/new");
  });

  it("resolves dynamic paths with arguments", () => {
    expect(ROUTES.custom.edit("preset-1")).toBe("/custom/preset-1/edit");
    expect(ROUTES.create.select("preset-2")).toBe("/create/preset-2/select");
    expect(ROUTES.create.review("preset-3")).toBe("/create/preset-3/review");
  });

  describe("create.crop", () => {
    it("resolves basic crop path", () => {
      expect(ROUTES.create.crop("preset-1", "variant-A")).toBe("/create/preset-1/variant-A");
    });

    it("appends singleEdit query parameter when specified", () => {
      expect(ROUTES.create.crop("preset-1", "variant-A", { singleEdit: true })).toBe(
        "/create/preset-1/variant-A?singleEdit=true",
      );
    });

    it("ignores singleEdit option when false", () => {
      expect(ROUTES.create.crop("preset-1", "variant-A", { singleEdit: false })).toBe(
        "/create/preset-1/variant-A",
      );
    });
  });
});
