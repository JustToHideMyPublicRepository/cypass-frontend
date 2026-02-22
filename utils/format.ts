/**
 * Decodes HTML entities (e.g., &#039; to ')
 */
export const decodeHtml = (html: string) => {
  if (!html) return ''
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

/**
 * Decodes HTML entities using a browser-less approach if needed (fallback)
 * but since this runs in the client for most cases, the textarea trick is reliable.
 * For server-side rendering or non-browser environments:
 */
export const decodeHtmlEntities = (text: string) => {
  if (!text) return ''
  return text.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec)
  }).replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
}
