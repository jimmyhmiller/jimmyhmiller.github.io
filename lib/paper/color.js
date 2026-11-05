// WCAG relative luminance and contrast ratio for six-digit hex colors.
const linear = (value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

export function luminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new TypeError(`Expected six-digit hex color, got ${hex}`);
  const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
