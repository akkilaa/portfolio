export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

// Full years elapsed from `start` until today (floored, anniversary-aware).
export function countYearsUntilToday(start: string | Date): number {
  const from = typeof start === 'string' ? new Date(start) : start
  const now = new Date()
  let years = now.getFullYear() - from.getFullYear()
  const beforeAnniversary =
    now.getMonth() < from.getMonth() ||
    (now.getMonth() === from.getMonth() && now.getDate() < from.getDate())
  if (beforeAnniversary) years--
  return years
}
