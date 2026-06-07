export function encodeBMP(imageData: ImageData): Blob {
  const { width, height, data } = imageData;

  // BMP rows must be padded to a multiple of 4 bytes
  const rowSize = Math.floor((width * 24 + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // --- BMP Header (14 bytes) ---
  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, 54, true);

  // --- DIB Header (40 bytes) ---
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  // Positive height means bottom-up, which is safest for legacy games
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // --- Pixel Data ---
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const srcOffset = (y * width + x) * 4;
      view.setUint8(rowOffset, data[srcOffset + 2]);
      view.setUint8(rowOffset + 1, data[srcOffset + 1]);
      view.setUint8(rowOffset + 2, data[srcOffset + 0]);
      rowOffset += 3;
    }
    offset += rowSize;
  }

  return new Blob([buffer], { type: "image/bmp" });
}

export function encodeTGA(imageData: ImageData): Blob {
  const { width, height, data } = imageData;

  const headerSize = 18;
  const pixelArraySize = width * height * 4;
  const buffer = new ArrayBuffer(headerSize + pixelArraySize);
  const view = new DataView(buffer);

  // --- TGA Header (18 bytes) ---
  view.setUint8(0, 0);
  view.setUint8(1, 0);
  view.setUint8(2, 2);

  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, width, true);
  view.setUint16(14, height, true);
  view.setUint8(16, 32);

  // Image descriptor: bits 0-3 = alpha depth (8). bit 5 = top-to-bottom origin (1).
  view.setUint8(17, 0x20 | 0x08);

  // --- Pixel Data ---
  // TGA type 2 with bit 5 set stores pixels top-down, BGRA
  let offset = headerSize;
  for (let i = 0; i < data.length; i += 4) {
    view.setUint8(offset, data[i + 2]);
    view.setUint8(offset + 1, data[i + 1]);
    view.setUint8(offset + 2, data[i + 0]);
    view.setUint8(offset + 3, data[i + 3]);
    offset += 4;
  }

  return new Blob([buffer], { type: "image/x-tga" });
}
