export function getSubscriptionPrice(plan: 'monthly' | 'yearly') {
  return plan === 'monthly' ? 9.99 : 99.99
}

export function getSubscriptionExpiry(plan: 'monthly' | 'yearly') {
  const now = new Date()
  if (plan === 'monthly') {
    now.setMonth(now.getMonth() + 1)
  } else {
    now.setFullYear(now.getFullYear() + 1)
  }
  return now
}
