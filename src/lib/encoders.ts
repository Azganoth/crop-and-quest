/**
 * Custom zero-dependency encoders for legacy formats required by classic CRPGs.
 */

export function encodeBMP(imageData: ImageData): Blob {
  const { width, height, data } = imageData;

  // BMP rows must be padded to a multiple of 4 bytes
  const rowSize = Math.floor((width * 24 + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // --- BMP Header (14 bytes) ---
  view.setUint8(0, 0x42); // 'B'
  view.setUint8(1, 0x4d); // 'M'
  view.setUint32(2, fileSize, true); // File size
  view.setUint32(6, 0, true); // Reserved
  view.setUint32(10, 54, true); // Pixel data offset

  // --- DIB Header (40 bytes) ---
  view.setUint32(14, 40, true); // Header size
  view.setInt32(18, width, true); // Width
  // Positive height means bottom-up, which is safest for legacy games
  view.setInt32(22, height, true); // Height
  view.setUint16(26, 1, true); // Color planes
  view.setUint16(28, 24, true); // Bits per pixel (24-bit RGB)
  view.setUint32(30, 0, true); // Compression (0 = none)
  view.setUint32(34, pixelArraySize, true); // Image size
  view.setInt32(38, 2835, true); // X pixels per meter (72 DPI)
  view.setInt32(42, 2835, true); // Y pixels per meter (72 DPI)
  view.setUint32(46, 0, true); // Colors in palette
  view.setUint32(50, 0, true); // Important colors

  // --- Pixel Data ---
  // BMP stores pixels bottom-up and in BGR order
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const srcOffset = (y * width + x) * 4;
      // BGR
      view.setUint8(rowOffset, data[srcOffset + 2]); // B
      view.setUint8(rowOffset + 1, data[srcOffset + 1]); // G
      view.setUint8(rowOffset + 2, data[srcOffset + 0]); // R
      rowOffset += 3;
    }
    // Padding bytes are naturally 0 from ArrayBuffer initialization
    offset += rowSize;
  }

  return new Blob([buffer], { type: "image/bmp" });
}

export function encodeTGA(imageData: ImageData): Blob {
  const { width, height, data } = imageData;

  const headerSize = 18;
  const pixelArraySize = width * height * 4; // 32-bit BGRA
  const buffer = new ArrayBuffer(headerSize + pixelArraySize);
  const view = new DataView(buffer);

  // --- TGA Header (18 bytes) ---
  view.setUint8(0, 0); // ID length
  view.setUint8(1, 0); // Color map type (0 = no color map)
  view.setUint8(2, 2); // Image type (2 = uncompressed true-color)
  // Color map spec (5 bytes) all 0
  view.setUint16(8, 0, true); // X origin
  view.setUint16(10, 0, true); // Y origin
  view.setUint16(12, width, true); // Width
  view.setUint16(14, height, true); // Height
  view.setUint8(16, 32); // Pixel depth (32-bit)
  // Image descriptor: bits 0-3 = alpha depth (8). bit 5 = top-to-bottom origin (1).
  view.setUint8(17, 0x20 | 0x08);

  // --- Pixel Data ---
  // TGA type 2 with bit 5 set stores pixels top-down, BGRA
  let offset = headerSize;
  for (let i = 0; i < data.length; i += 4) {
    view.setUint8(offset, data[i + 2]); // B
    view.setUint8(offset + 1, data[i + 1]); // G
    view.setUint8(offset + 2, data[i + 0]); // R
    view.setUint8(offset + 3, data[i + 3]); // A
    offset += 4;
  }

  return new Blob([buffer], { type: "image/x-tga" });
}
