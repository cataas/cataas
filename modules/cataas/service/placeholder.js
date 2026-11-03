export const MAX_SIZE = 1000

export const mimeByFormat = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif'
}

const extensions = { png: 'png', jpg: 'jpeg', jpeg: 'jpeg', webp: 'webp', avif: 'avif' }

// "600x400" or "600x400.png" -> { width, height, format }, null if invalid
export const parsePlaceholderSize = (size) => {
  const match = /^(\d{1,4})x(\d{1,4})(?:\.(\w+))?$/.exec(size || '')
  if (!match) return null

  const width = Math.min(Number(match[1]), MAX_SIZE)
  const height = Math.min(Number(match[2]), MAX_SIZE)
  if (width < 1 || height < 1) return null

  const format = match[3] ? extensions[match[3].toLowerCase()] : undefined
  if (match[3] && !format) return null

  return { width, height, format }
}

export const escapeXml = (text) => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

export const defaultFontSize = (width, height) => Math.max(12, Math.round(Math.min(width, height) / 10))
