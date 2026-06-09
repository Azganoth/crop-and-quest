import { describe, expect, it } from "vitest";
import { encodeBMP, encodeTGA } from "./encoders";

describe("Binary Encoders", () => {
  // A simple 2x2 fake image data
  // 4 pixels * 4 channels (RGBA) = 16 bytes
  const mockImageData = {
    width: 2,
    height: 2,
    data: new Uint8ClampedArray([
      255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
    ]),
  } as unknown as ImageData;

  describe("encodeBMP", () => {
    it("generates a valid BMP Blob with correct headers and size", async () => {
      const blob = encodeBMP(mockImageData);

      // Width = 2. 2 * 24 bits = 48 bits. Padded to multiple of 32 bits = 64 bits = 8 bytes per row.
      // Height = 2 rows. Total pixel data = 16 bytes.
      // Header size = 54 bytes. Total file size = 70 bytes.
      expect(blob.type).toBe("image/bmp");
      expect(blob.size).toBe(70);

      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);

      expect(view.getUint8(0)).toBe(0x42);
      expect(view.getUint8(1)).toBe(0x4d);

      expect(view.getUint32(2, true)).toBe(70);

      expect(view.getInt32(18, true)).toBe(2);
      expect(view.getInt32(22, true)).toBe(2);

      expect(view.getUint16(28, true)).toBe(24);
    });
  });

  describe("encodeTGA", () => {
    it("generates a valid TGA Blob with correct headers and size", async () => {
      const blob = encodeTGA(mockImageData);

      // Header size = 18 bytes.
      // Pixel data = 2 * 2 * 4 bytes = 16 bytes.
      // Total file size = 34 bytes.
      expect(blob.type).toBe("image/x-tga");
      expect(blob.size).toBe(34);

      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);

      expect(view.getUint8(2)).toBe(2);

      expect(view.getUint16(12, true)).toBe(2);
      expect(view.getUint16(14, true)).toBe(2);

      expect(view.getUint8(16)).toBe(32);

      expect(view.getUint8(17)).toBe(0x20 | 0x08);
    });
  });
});
