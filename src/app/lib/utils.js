export function formatMinutesSinceMidnight(minutes) {
  if (minutes == null || isNaN(minutes)) return "Unknown";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Format using a 12-hour clock with AM/PM:
  const time = new Date(0, 0, 0, hours, mins);
  return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  // If you prefer 24-hour time, use:
  // return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
