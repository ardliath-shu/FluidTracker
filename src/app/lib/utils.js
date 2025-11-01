export function formatMinutesSinceMidnight(minutes) {
  if (minutes == null || isNaN(minutes)) return "Unknown";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const time = new Date(0, 0, 0, hours, mins);

  // Format time as HH:MM 24Hour with leading zero
  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return timeString;
}
