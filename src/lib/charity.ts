export function calculateContribution(
  amount: number,
  charityPercent: number
) {
  const charityAmount = (amount * charityPercent) / 100;
  const prizePool = (amount * (100 - charityPercent)) / 100 * 0.5;
  const platform = amount - charityAmount - prizePool;
  return { charityAmount, prizePool, platform };
}
