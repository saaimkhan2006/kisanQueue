/**
 * Calculates total expected turnaround time at a centre (The Core Deterministic Algorithm)
 * Total Expected Time = Travel Time + Queue Wait Time + Processing Time
 */
export function calculateTotalExpectedTime(travelTimeMinutes, queueWaitMinutes, processingTimeMinutes = 30) {
  return travelTimeMinutes + queueWaitMinutes + processingTimeMinutes;
}

/**
 * Format minutes to hours and minutes string (e.g. 95 -> "1h 35m")
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

/**
 * Calculate recommended departure time
 * Given expected turn time (Date or timestamp) and commute time in minutes
 */
export function calculateDepartureTime(expectedTurnTime, commuteMinutes) {
  const turnDate = new Date(expectedTurnTime);
  const departureDate = new Date(turnDate.getTime() - commuteMinutes * 60 * 1000);
  return departureDate;
}

/**
 * Format time to standard 12-hour AM/PM string
 */
export function formatTime(date) {
  if (!date) return '--:--';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculate minutes difference from now
 */
export function getMinutesFromNow(futureDate) {
  const now = new Date();
  const target = new Date(futureDate);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.round(diffMs / (60 * 1000)));
}
