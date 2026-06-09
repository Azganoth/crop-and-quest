import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { PresetGrid } from "./PresetGrid";
import { PRESETS } from "@/data/presets";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { createMockCustomPreset } from "@/test/factories";
import { render, renderWithUser } from "@/test/utils";

const MOCK_CUSTOM_PRESET = createMockCustomPreset();

describe("PresetGrid", () => {
  beforeEach(() => {
    useCustomPresetsStore.getState().addCustomPreset(MOCK_CUSTOM_PRESET);
  });

  it("renders official presets from the data store", () => {
    render(<PresetGrid />);

    expect(screen.getByText(PRESETS[0].name)).toBeInTheDocument();
  });

  it("renders custom presets from the Zustand store", async () => {
    render(<PresetGrid />);

    expect(await screen.findByText("My Custom RPG")).toBeInTheDocument();
  });

  it("deletes a custom preset when the user confirms the dialog", async () => {
    const { user } = renderWithUser(<PresetGrid />);

    expect(await screen.findByText("My Custom RPG")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "Delete My Custom RPG" });
    await user.click(deleteButton);

    const dialogTitle = await screen.findByText("Delete Custom Preset");
    expect(dialogTitle).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Delete" });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(useCustomPresetsStore.getState().customPresets).toHaveLength(0);
    });

    await waitFor(() => {
      expect(screen.queryByText("My Custom RPG")).not.toBeInTheDocument();
    });
  });
});
