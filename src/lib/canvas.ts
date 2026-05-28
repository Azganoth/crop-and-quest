export function createImage(url: string): Promise<HTMLImageElement> {
  const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>();

  const image = new Image();

  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  // Important for cross-origin if we ever load external images, though ours are local object URLs
  image.setAttribute("crossOrigin", "anonymous");

  image.src = url;

  return promise;
}

export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

function encodeBMP(imageData: ImageData): Blob {
  const { width, height, data } = imageData;
  const rowSize = Math.floor((width * 24 + 31) / 32) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, fileSize, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  view.setUint32(10, 54, true);

  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelDataSize, true);
  view.setInt32(38, 0, true);
  view.setInt32(42, 0, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const srcOffset = (y * width + x) * 4;
      view.setUint8(rowOffset, data[srcOffset + 2]);
      view.setUint8(rowOffset + 1, data[srcOffset + 1]);
      view.setUint8(rowOffset + 2, data[srcOffset]);
      rowOffset += 3;
    }
    offset += rowSize;
  }

  return new Blob([buffer], { type: "image/bmp" });
}

function encodeTGA(imageData: ImageData): Blob {
  const { width, height, data } = imageData;
  const pixelDataSize = width * height * 3;
  const buffer = new ArrayBuffer(18 + pixelDataSize);
  const view = new DataView(buffer);

  view.setUint8(2, 2);
  view.setUint16(12, width, true);
  view.setUint16(14, height, true);
  view.setUint8(16, 24);

  let offset = 18;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcOffset = (y * width + x) * 4;
      view.setUint8(offset, data[srcOffset + 2]);
      view.setUint8(offset + 1, data[srcOffset + 1]);
      view.setUint8(offset + 2, data[srcOffset]);
      offset += 3;
    }
  }

  return new Blob([buffer], { type: "image/tga" });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  variantWidth: number,
  variantHeight: number,
  format: "png" | "jpeg" | "webp" | "bmp" | "tga" = "png",
  quality = 1.0,
): Promise<string> {
  const image = await createImage(imageSrc);

  const bBoxWidth =
    Math.abs(Math.cos(getRadianAngle(rotation)) * image.width) +
    Math.abs(Math.sin(getRadianAngle(rotation)) * image.height);
  const bBoxHeight =
    Math.abs(Math.sin(getRadianAngle(rotation)) * image.width) +
    Math.abs(Math.cos(getRadianAngle(rotation)) * image.height);

  const interCanvas = document.createElement("canvas");
  interCanvas.width = bBoxWidth;
  interCanvas.height = bBoxHeight;
  const interCtx = interCanvas.getContext("2d");
  if (!interCtx) throw new Error("Failed to get intermediate canvas context");

  interCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  interCtx.rotate(getRadianAngle(rotation));
  interCtx.translate(-image.width / 2, -image.height / 2);
  interCtx.drawImage(image, 0, 0);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get final canvas context");

  canvas.width = variantWidth;
  canvas.height = variantHeight;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    interCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    variantWidth,
    variantHeight,
  );

  const { promise, resolve, reject } = Promise.withResolvers<string>();

  if (format === "bmp") {
    const imageData = ctx.getImageData(0, 0, variantWidth, variantHeight);
    const blob = encodeBMP(imageData);
    resolve(URL.createObjectURL(blob));
  } else if (format === "tga") {
    const imageData = ctx.getImageData(0, 0, variantWidth, variantHeight);
    const blob = encodeTGA(imageData);
    resolve(URL.createObjectURL(blob));
  } else {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Canvas export is empty"));
        else resolve(URL.createObjectURL(blob));
      },
      `image/${format}`,
      quality,
    );
  }

  return promise;
}
