export function validateScore(score: number): boolean {
  return Number.isInteger(score) && score >= 1 && score <= 45
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}