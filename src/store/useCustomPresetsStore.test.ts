import { describe, expect, it } from "vitest";
import { useCustomPresetsStore } from "./useCustomPresetsStore";
import { createMockCustomPreset } from "@/test/factories";

const MOCK_PRESET = createMockCustomPreset();

describe("useCustomPresetsStore", () => {
  it("starts with an empty custom presets array", () => {
    const state = useCustomPresetsStore.getState();
    expect(state.customPresets).toEqual([]);
  });

  it("adds a custom preset", () => {
    useCustomPresetsStore.getState().addCustomPreset(MOCK_PRESET);
    const state = useCustomPresetsStore.getState();
    expect(state.customPresets).toHaveLength(1);
    expect(state.customPresets[0]).toEqual(MOCK_PRESET);
  });

  it("updates an existing custom preset", () => {
    useCustomPresetsStore.getState().addCustomPreset(MOCK_PRESET);
    const updatedPreset = { ...MOCK_PRESET, name: "Updated Name" };
    useCustomPresetsStore.getState().updateCustomPreset(MOCK_PRESET.id, updatedPreset);

    const state = useCustomPresetsStore.getState();
    expect(state.customPresets).toHaveLength(1);
    expect(state.customPresets[0].name).toBe("Updated Name");
  });

  it("removes a custom preset", () => {
    useCustomPresetsStore.getState().addCustomPreset(MOCK_PRESET);
    useCustomPresetsStore.getState().removeCustomPreset(MOCK_PRESET.id);
    const state = useCustomPresetsStore.getState();
    expect(state.customPresets).toHaveLength(0);
  });
});
