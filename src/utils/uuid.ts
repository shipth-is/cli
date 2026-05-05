/**
 * Works the same way that git short commits are generated.
 * Used for most uuids on the backend where the short value should be unique within one users account.
 */
export function getShortUUID(originalUuid: string): string {
  return originalUuid.slice(0, 8)
}
