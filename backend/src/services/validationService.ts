export function validateTimestamp(timestamp: number) {
  const now = Date.now()
  return Math.abs(now - timestamp) <= 30000 // 30 seconds in milliseconds
}