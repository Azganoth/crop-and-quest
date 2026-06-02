const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export function getAspectRatioString(width: number, height: number) {
  if (width <= 0 || height <= 0) return `${width}:${height}`;

  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}
