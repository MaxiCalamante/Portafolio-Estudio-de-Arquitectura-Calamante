const accents: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n',
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (letter) => accents[letter])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function safeFileName(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`
  return `${id}.${extension.replace(/[^a-z0-9]/g, '')}`
}
