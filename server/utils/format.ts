// check if the color is in the format of #RRGGBB
export function isValidColor(color: string) {
  return /^#[0-9A-F]{6}$/i.test(color)
}
