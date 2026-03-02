export function lightenDarkenColor(col, amt) {
  console.log(col)
  const num = parseInt(col.substring(1), 16)
  const r = (num >> 16) + amt
  const b = ((num >> 8) & 0x00ff) + amt
  const g = (num & 0x0000ff) + amt
  const newColor = g | (b << 8) | (r << 16)
  return '#' + newColor.toString(16)
}
