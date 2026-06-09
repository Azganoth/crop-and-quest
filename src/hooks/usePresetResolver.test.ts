import { describe, expect, it, beforeEach } from "vitest";
import { usePresetResolver } from "./usePresetResolver";
import { PRESETS } from "@/data/presets";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { createMockCustomPreset } from "@/test/factories";
import { renderHook } from "@/test/utils";

const MOCK_CUSTOM_PRESET = createMockCustomPreset();

describe("usePresetResolver", () => {
  beforeEach(() => {
    useCustomPresetsStore.getState().addCustomPreset(MOCK_CUSTOM_PRESET);
  });

  it("returns undefined if no presetId is provided", () => {
    const { result } = renderHook(() => usePresetResolver(undefined));
    expect(result.current.preset).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("resolves an official preset by id", () => {
    const officialPresetId = PRESETS[0].id;
    const { result } = renderHook(() => usePresetResolver(officialPresetId));

    expect(result.current.preset).toBeDefined();
    expect(result.current.preset?.id).toBe(officialPresetId);
    expect(result.current.isLoading).toBe(false);
  });

  it("resolves a custom preset by id", () => {
    const { result } = renderHook(() => usePresetResolver(MOCK_CUSTOM_PRESET.id));

    expect(result.current.preset).toBeDefined();
    expect(result.current.preset?.id).toBe(MOCK_CUSTOM_PRESET.id);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns undefined for a non-existent preset id", () => {
    const { result } = renderHook(() => usePresetResolver("does-not-exist"));

    expect(result.current.preset).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
