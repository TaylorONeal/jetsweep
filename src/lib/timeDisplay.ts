/** Keep upcoming trips readable instead of showing thousands of hours. */
export function formatCountdown(minutes: number): string {
  const total = Math.max(0, Math.ceil(minutes));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${total % 60}m`;
  return `${total}m`;
}
