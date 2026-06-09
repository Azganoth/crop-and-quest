import type { Preset } from "@/data/presets";

export function createMockCustomPreset(overrides?: Partial<Preset>): Preset {
  return {
    id: "custom-grid-123",
    name: "My Custom RPG",
    exportConfig: { defaultName: "custom", wrapInFolder: false },
    variants: [
      {
        key: "variant-1",
        label: "Main",
        width: 100,
        height: 100,
        format: "png",
        filename: "test",
      },
    ],
    ...overrides,
  };
}
