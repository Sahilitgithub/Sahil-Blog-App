import DOMPurify from "isomorphic-dompurify";

/**
 * Convert HTML to plain text and truncate
 * @param html - HTML string
 * @param maxLength - Maximum characters
 * @returns plain text string
 */
export const PlainTextForDescription = (html: string, maxLength: number): string => {
  if (!html) return "";

  // Sanitize HTML
  const sanitized = DOMPurify.sanitize(html);

  // Strip remaining HTML tags
  const plainText = sanitized.replace(/<[^>]+>/g, "");

  // Truncate with ellipsis
  return plainText.length > maxLength ? plainText.slice(0, maxLength) + "…" : plainText;
};
