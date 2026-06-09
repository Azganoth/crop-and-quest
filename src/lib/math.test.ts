import { describe, expect, it } from "vitest";
import { getAspectRatioString } from "./math";

describe("getAspectRatioString", () => {
  it("calculates common aspect ratios correctly", () => {
    expect(getAspectRatioString(1920, 1080)).toBe("16:9");
    expect(getAspectRatioString(1080, 1920)).toBe("9:16");
    expect(getAspectRatioString(800, 600)).toBe("4:3");
    expect(getAspectRatioString(1000, 1000)).toBe("1:1");
  });

  it("simplifies obscure dimensions", () => {
    expect(getAspectRatioString(210, 330)).toBe("7:11");
    expect(getAspectRatioString(256, 128)).toBe("2:1");
  });

  it("handles zero or negative dimensions gracefully", () => {
    expect(getAspectRatioString(0, 100)).toBe("0:100");
    expect(getAspectRatioString(100, 0)).toBe("100:0");
    expect(getAspectRatioString(-16, 9)).toBe("-16:9");
  });
});
