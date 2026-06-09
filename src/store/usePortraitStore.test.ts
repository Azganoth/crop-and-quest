import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePortraitStore, type CropState } from "./usePortraitStore";

describe("usePortraitStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.URL.createObjectURL = vi.fn(() => "blob:fake-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("sets preset id", () => {
    usePortraitStore.getState().setPresetId("test-preset");
    expect(usePortraitStore.getState().presetId).toBe("test-preset");
  });

  it("sets an image and generates an object URL", () => {
    const fakeFile = new File([""], "test.png", { type: "image/png" });
    usePortraitStore.getState().setImage(fakeFile);

    const state = usePortraitStore.getState();
    expect(state.imageFile).toBe(fakeFile);
    expect(state.imageUrl).toBe("blob:fake-url");
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeFile);
  });

  it("revokes the old image URL when setting a new image", () => {
    const fakeFile1 = new File([""], "test1.png", { type: "image/png" });
    const fakeFile2 = new File([""], "test2.png", { type: "image/png" });

    (global.URL.createObjectURL as any)
      .mockReturnValueOnce("blob:fake-url-1")
      .mockReturnValueOnce("blob:fake-url-2");

    usePortraitStore.getState().setImage(fakeFile1);
    expect(usePortraitStore.getState().imageUrl).toBe("blob:fake-url-1");

    usePortraitStore.getState().setImage(fakeFile2);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:fake-url-1");
    expect(usePortraitStore.getState().imageUrl).toBe("blob:fake-url-2");
  });

  it("sets crop data for a variant", () => {
    const mockCrop: CropState = { x: 10, y: 10, zoom: 1, rotation: 0 };
    usePortraitStore.getState().setCrop("variant-A", mockCrop);

    const state = usePortraitStore.getState();
    expect(state.crops["variant-A"]).toEqual(mockCrop);
  });

  it("clears the session and revokes all object URLs", () => {
    const fakeFile = new File([""], "test.png", { type: "image/png" });
    (global.URL.createObjectURL as any).mockReturnValue("blob:fake-image-url");

    const store = usePortraitStore.getState();
    store.setImage(fakeFile);

    store.setCrop("variant-A", {
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
      croppedBlobUrl: "blob:fake-crop-url",
    });

    store.clearSession();

    const state = usePortraitStore.getState();
    expect(state.imageFile).toBeNull();
    expect(state.imageUrl).toBeNull();
    expect(state.crops).toEqual({});

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:fake-image-url");
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:fake-crop-url");
  });
});
