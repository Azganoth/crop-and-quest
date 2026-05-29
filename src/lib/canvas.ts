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
import { encodeBMP, encodeTGA } from "./encoders";
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
